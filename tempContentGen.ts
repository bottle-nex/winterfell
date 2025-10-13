
import { GoogleGenAI } from '@google/genai';
import env from '../../configs/env';
import { SYSTEM_PROMPT } from '../../prompt/gemini';
import { Response } from 'express';
import { Chat, ChatRole, Message, prisma } from '@repo/database';
import StreamParser from '../../services/StreamParser';
import { STREAM_EVENT_ENUM } from '../../types/StreamEventTypes';

enum ChatState {
    START,
    STREAMING,
    COMPLETE,
}

interface CtxObject {
    role: 'user' | 'model';
    parts: {
        text: string;
    }[];
}

export default class ContentGenerator {
    public ai: GoogleGenAI;
    public system_prompt: string;
    private parsers: Map<string, StreamParser>; // contract-id -> stream-parser

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
                messageId: message.id,
                chatId: chat.id,
                contractId: contract_id,
                timestamp: Date.now(),
            })}\n\n`,
        );

        try {
            const full_response = await this.generate_streaming_response(
                res,
                message,
                chat,
                parser,
            );

            // const filterCode = extractRustCode(full_response);

            if (full_response.includes('```rust') || full_response.includes('```')) {
                const codeMatch = full_response.match(/```(?:rust)?\n([\s\S]*?)```/);
                if (codeMatch && codeMatch[1]) {
                    await prisma.contract.update({
                        where: { id: contract_id },
                        data: { code: codeMatch[1].trim() },
                    });
                }

                parser.complete();
                parser.reset();
                this.delete_parser(contract_id);

                res.end();
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
                        text: 'Understood. I will help you create Anchor smart contracts following these guidelines.',
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

            console.log('starting stream');

            const response = await this.ai.models.generateContentStream({
                model: 'gemini-2.0-flash-exp',
                contents,
            });

            for await (const chunk of response) {
                if (chunk.text) {
                    // Accumulate full response
                    full_response += chunk.text;

                    // Parse and send structured events
                    console.log(chunk.text);
                    parser.feed(chunk.text);
                }
            }

            console.log('\n Stream complete');

            // Save complete response to database
            await this.save_llm_response_to_db(full_response, chat.id);

            return full_response;
        } catch (llm_error) {
            console.error('LLM Error:', llm_error);

            // Send error through SSE
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
            console.log('Response saved to database');
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
