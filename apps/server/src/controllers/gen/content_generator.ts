import { GoogleGenAI } from '@google/genai';
import env from '../../configs/env';
import { Response } from 'express';
import { Chat, ChatRole, Message, prisma } from '@repo/database';
import StreamParser from '../../services/stream_parser';
import { STREAM_EVENT_ENUM } from '../../types/stream_event_types';
import { SYSTEM_PROMPT } from '../../prompt/system';
import { objectStore } from '../../services/init';

interface CtxObject {
    role: 'user' | 'model';
    parts: {
        text: string;
    }[];
}

export default class ContentGenerator {
    public ai: GoogleGenAI;
    public system_prompt: string;
    private parsers: Map<string, StreamParser>;

    constructor() {
        this.system_prompt = SYSTEM_PROMPT;
        this.ai = new GoogleGenAI({
            apiKey: env.SERVER_GEMINI_API_KEY,
        });
        this.parsers = new Map<string, StreamParser>();
    }

    public async generate_initial_response(
        res: Response,
        message: Message,
        chat: Chat & { messages: Message[] },
        contract_id: string,
    ) {
        const parser = this.get_parser(contract_id, res);
        this.generate_content_stream(res);

        res.write(
            `data: ${JSON.stringify({
                type: STREAM_EVENT_ENUM.START,
                data: {
                    messageId: message.id,
                    chatId: chat.id,
                    contractId: contract_id,
                    timestamp: Date.now(),
                },
            })}\n\n`,
        );

        try {
            await this.generate_streaming_response(res, message, chat, parser);

            const generatedFiles = parser.getGeneratedFiles();
            // console.log('generate files are ------------------------------------->');
            // console.log(generatedFiles);
            objectStore.uploadContractFiles(contract_id, generatedFiles);
            if (generatedFiles.length > 0) {
                this.delete_parser(contract_id);
                res.end();
            } else {
                throw new Error('No files were generated');
            }
        } catch (error) {
            console.error('Error in generate_initial_response:', error);
            this.sendSSE(res, STREAM_EVENT_ENUM.ERROR, {
                message: 'Failed to generate response',
                error: error instanceof Error ? error.message : 'Unknown error',
            });

            parser.reset();
            this.delete_parser(contract_id);
            res.end();
        }
    }

    public async generate_streaming_response(
        res: Response,
        message: Message,
        chat: Chat & { messages: Message[] },
        parser: StreamParser,
    ): Promise<string> {
        const contents: CtxObject[] = [];
        let full_response = '';

        try {
            contents.push({
                role: 'user',
                parts: [{ text: this.system_prompt }],
            });

            contents.push({
                role: 'model',
                parts: [
                    {
                        text: 'Understood. I will generate well-structured Anchor smart contracts with proper file organization, following all the specified guidelines.',
                    },
                ],
            });

            for (const msg of chat.messages) {
                contents.push({
                    role: msg.role === 'USER' ? 'user' : 'model',
                    parts: [{ text: msg.content }],
                });
            }

            contents.push({
                role: 'user',
                parts: [{ text: message.content }],
            });

            const response = await this.ai.models.generateContentStream({
                model: 'gemini-2.0-flash-exp',
                contents,
            });

            for await (const chunk of response) {
                if (chunk.text) {
                    full_response += chunk.text;
                    parser.feed(chunk.text);
                }
            }

            // Save complete response to database
            await this.save_llm_response_to_db(full_response, chat.id);
            // console.log('full response is -------------------------------------------------->');
            // console.log(full_response);
            return full_response;
        } catch (llm_error) {
            console.error('LLM Error:', llm_error);

            res.write(
                `data: ${JSON.stringify({
                    type: 'error',
                    data: {
                        message: 'LLM generation failed',
                        error: llm_error instanceof Error ? llm_error.message : 'Unknown error',
                    },
                    timestamp: Date.now(),
                })}\n\n`,
            );

            throw llm_error;
        }
    }

    private async save_llm_response_to_db(full_response: string, chat_id: string) {
        try {
            await prisma.message.create({
                data: {
                    chatId: chat_id,
                    role: ChatRole.AI,
                    content: full_response,
                },
            });
        } catch (error) {
            console.error('error saving to database:', error);
        }
    }

    public generate_content_stream(res: Response) {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('X-Accel-Buffering', 'no'); // Disable nginx buffering
        res.flushHeaders();
    }

    private get_parser(contract_id: string, res: Response): StreamParser {
        if (!this.parsers.has(contract_id)) {
            const parser = new StreamParser();

            parser.on(STREAM_EVENT_ENUM.PHASE, (data) =>
                this.sendSSE(res, STREAM_EVENT_ENUM.PHASE, data),
            );

            parser.on(STREAM_EVENT_ENUM.EDITING_FILE, (data) =>
                this.sendSSE(res, STREAM_EVENT_ENUM.EDITING_FILE, data),
            );

            parser.on(STREAM_EVENT_ENUM.CONTEXT, (data) =>
                this.sendSSE(res, STREAM_EVENT_ENUM.CONTEXT, data),
            );

            parser.on(STREAM_EVENT_ENUM.FILE_STRUCTURE, (data) =>
                this.sendSSE(res, STREAM_EVENT_ENUM.FILE_STRUCTURE, data),
            );

            parser.on(STREAM_EVENT_ENUM.COMPLETE, (data) =>
                this.sendSSE(res, STREAM_EVENT_ENUM.COMPLETE, data),
            );

            parser.on(STREAM_EVENT_ENUM.ERROR, (data) =>
                this.sendSSE(res, STREAM_EVENT_ENUM.ERROR, data),
            );

            this.parsers.set(contract_id, parser);
        }
        return this.parsers.get(contract_id)!;
    }

    private delete_parser(contract_id: string) {
        this.parsers.delete(contract_id);
    }

    private sendSSE(res: Response, type: STREAM_EVENT_ENUM, data: any) {
        res.write(
            `data: ${JSON.stringify({
                type,
                data,
                timestamp: Date.now(),
            })}\n\n`,
        );
    }
}
