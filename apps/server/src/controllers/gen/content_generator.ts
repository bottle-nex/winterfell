import { GoogleGenAI } from '@google/genai';
import env from '../../configs/env';
import { Response } from 'express';
import { Chat, ChatRole, Message, prisma, SystemMessageType } from '@repo/database';
import StreamParser from '../../services/stream_parser';
import { SYSTEM_PROMPT } from '../../prompt/system';
import { objectStore } from '../../services/init';
import { logger } from '../../utils/logger';
import { FILE_STRUCTURE_TYPES, PHASE_TYPES } from '../../types/stream_event_types';

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
        this.create_stream(res);

        const system_message = await prisma.message.create({
            data: {
                chatId: chat.id,
                role: ChatRole.SYSTEM,
                content: 'starting to generate in a few seconds',
                systemType: SystemMessageType.BUILD_START,
                systemData: {
                    messageId: message.id,
                    chatId: chat.id,
                    contractId: contract_id,
                },
            },
        });

        this.sendSSE(
            res,
            PHASE_TYPES.THINKING,
            {
                messageId: message.id,
                chatId: chat.id,
                contractId: contract_id,
                timestamp: Date.now(),
            },
            system_message,
        );

        try {
            await this.generate_streaming_response(res, message, chat, parser, system_message);

            const generatedFiles = parser.getGeneratedFiles();
            objectStore.uploadContractFiles(contract_id, generatedFiles);
            if (generatedFiles.length > 0) {
                this.delete_parser(contract_id);
                res.end();
            } else {
                throw new Error('No files were generated');
            }
        } catch (error) {
            logger.error('Error in generate_initial_response:', error);
            this.sendSSE(
                res,
                PHASE_TYPES.ERROR,
                {
                    message: 'Failed to generate response',
                    error: error instanceof Error ? error.message : 'Unknown error',
                },
                system_message,
            );

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
        system_message: Message,
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

            system_message = await prisma.message.update({
                where: {
                    id: system_message.id,
                },
                data: {
                    systemType: SystemMessageType.BUILD_PROGRESS,
                    content: 'working on your command',
                },
            });

            for await (const chunk of response) {
                if (chunk.text) {
                    full_response += chunk.text;
                    parser.feed(chunk.text, system_message);
                }
            }

            await this.save_llm_response_to_db(full_response, chat.id);
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

            await prisma.message.update({
                where: {
                    id: system_message.id,
                },
                data: {
                    systemType: SystemMessageType.BUILD_ERROR,
                    content: 'LLM generation failed',
                },
            });

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

    public create_stream(res: Response) {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('X-Accel-Buffering', 'no');
        res.flushHeaders();
    }

    private get_parser(contract_id: string, res: Response): StreamParser {
        if (!this.parsers.has(contract_id)) {
            const parser = new StreamParser();

            parser.on(PHASE_TYPES.THINKING, ({ data, systemMessage }) =>
                this.sendSSE(res, PHASE_TYPES.THINKING, data, systemMessage),
            );

            parser.on(PHASE_TYPES.GENERATING, ({ data, systemMessage }) =>
                this.sendSSE(res, PHASE_TYPES.GENERATING, data, systemMessage),
            );

            parser.on(PHASE_TYPES.BUILDING, ({ data, systemMessage }) =>
                this.sendSSE(res, PHASE_TYPES.BUILDING, data, systemMessage),
            );

            parser.on(PHASE_TYPES.CREATING_FILES, ({ data, systemMessage }) =>
                this.sendSSE(res, PHASE_TYPES.CREATING_FILES, data, systemMessage),
            );

            parser.on(PHASE_TYPES.COMPLETE, ({ data, systemMessage }) =>
                this.sendSSE(res, PHASE_TYPES.COMPLETE, data, systemMessage),
            );

            parser.on(FILE_STRUCTURE_TYPES.EDITING_FILE, ({ data, systemMessage }) =>
                this.sendSSE(res, FILE_STRUCTURE_TYPES.EDITING_FILE, data, systemMessage),
            );

            this.parsers.set(contract_id, parser);
        }
        return this.parsers.get(contract_id)!;
    }

    private delete_parser(contract_id: string) {
        this.parsers.delete(contract_id);
    }

    private sendSSE(
        res: Response,
        type: PHASE_TYPES | FILE_STRUCTURE_TYPES,
        data: any,
        systemMessage: Message,
    ) {
        res.write(
            `data: ${JSON.stringify({
                type,
                data,
                systemMessage,
                timestamp: Date.now(),
            })}\n\n`,
        );
    }
}
