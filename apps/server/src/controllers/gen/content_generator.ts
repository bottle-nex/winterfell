import { GoogleGenAI } from '@google/genai';
import Anthropic from '@anthropic-ai/sdk';
import env from '../../configs/env';
import { Response } from 'express';
import { ChatRole, Message, prisma, SystemMessageType } from '@repo/database';
import StreamParser from '../../services/stream_parser';
import { SYSTEM_PROMPT } from '../../prompt/system';
import { objectStore } from '../../services/init';
import { logger } from '../../utils/logger';
import {
    ErrorData,
    FILE_STRUCTURE_TYPES,
    PHASE_TYPES,
    StartingData,
    StreamEvent,
    StreamEventData,
} from '../../types/stream_event_types';
import { FileContent, STAGE } from '../../types/content_types';
import { mergeWithLLMFiles, prepareBaseTemplate } from '../../class/test';

type LLMProvider = 'gemini' | 'claude';

interface GeminiMessage {
    role: 'user' | 'model';
    parts: {
        text: string;
    }[];
}

interface ClaudeMessage {
    role: 'user' | 'assistant';
    content: string;
}

export default class ContentGenerator {
    public geminiAI: GoogleGenAI;
    public claudeAI: Anthropic;
    public systemPrompt: string;
    private parsers: Map<string, StreamParser>;

    constructor() {
        this.systemPrompt = SYSTEM_PROMPT;

        this.geminiAI = new GoogleGenAI({
            apiKey: env.SERVER_GEMINI_API_KEY,
        });

        this.claudeAI = new Anthropic({
            apiKey: env.SERVER_ANTHROPIC_API_KEY,
        });

        this.parsers = new Map<string, StreamParser>();
    }

    public async generateInitialResponse(
        res: Response,
        currentUserMessage: Message,
        messages: Message[],
        contractId: string,
        llmProvider: LLMProvider = 'claude',
    ): Promise<void> {
        const parser = this.getParser(contractId, res);
        this.createStream(res);

        try {
            const full_response = await this.generateStreamingResponse(
                res,
                currentUserMessage,
                messages,
                contractId,
                parser,
                llmProvider,
            );

            const llmGeneratedFiles: FileContent[] = parser.getGeneratedFiles();
            const contractName: string = parser.getContractName();
            const base_files: FileContent[] = prepareBaseTemplate(contractName);
            const final_code = mergeWithLLMFiles(base_files, llmGeneratedFiles);

            this.sendSSE(res, STAGE.END, { data: final_code });
            objectStore.uploadContractFiles(contractId, final_code, full_response);

            if (llmGeneratedFiles.length > 0) {
                this.deleteParser(contractId);
                res.end();
            } else {
                throw new Error('No files were generated');
            }
        } catch (error) {
            logger.error('Error in generateInitialResponse:', error);
            parser.reset();
            this.deleteParser(contractId);
            res.end();
        }
    }

    public async generateStreamingResponse(
        res: Response,
        currentUserMessage: Message,
        messages: Message[],
        contractId: string,
        parser: StreamParser,
        llmProvider: LLMProvider = 'gemini',
    ): Promise<string> {
        if (llmProvider === 'claude') {
            // return await this.generateClaudeStreamingResponse(
            //     res,
            //     currentUserMessage,
            //     messages,
            //     contractId,
            //     parser,
            // );
            return await this.generateGeminiStreamingResponse(
                res,
                currentUserMessage,
                messages,
                contractId,
                parser,
            );
        } else {
            return await this.generateGeminiStreamingResponse(
                res,
                currentUserMessage,
                messages,
                contractId,
                parser,
            );
        }
    }

    private async generateGeminiStreamingResponse(
        res: Response,
        currentUserMessage: Message,
        messages: Message[],
        contractId: string,
        parser: StreamParser,
    ): Promise<string> {
        logger.info('gemini llm used');
        const contents: GeminiMessage[] = [];
        let fullResponse = '';

        try {
            contents.push({
                role: 'user',
                parts: [{ text: this.systemPrompt }],
            });

            const startingData: StartingData = {
                stage: 'starting',
                contractId: contractId,
                timestamp: Date.now(),
            };

            this.sendSSE(res, STAGE.START, startingData);

            for (const msg of messages) {
                if (msg.role === ChatRole.AI || msg.role === ChatRole.USER) {
                    contents.push({
                        role: msg.role === 'USER' ? 'user' : 'model',
                        parts: [{ text: msg.content }],
                    });
                }
            }

            contents.push({
                role: 'user',
                parts: [{ text: currentUserMessage.content }],
            });

            const response = await this.geminiAI.models.generateContentStream({
                model: 'gemini-2.5-pro',
                contents,
            });

            const systemMessage = await prisma.message.create({
                data: {
                    contractId: contractId,
                    role: ChatRole.SYSTEM,
                    content: 'starting to generate in a few seconds',
                },
            });
            for await (const chunk of response) {
                if (chunk.text) {
                    fullResponse += chunk.text;
                    parser.feed(chunk.text, systemMessage);
                }
            }

            await this.saveLLMResponseToDb(fullResponse, contractId);
            return fullResponse;
        } catch (llmError) {
            const systemMessage = await prisma.message.update({
                where: {
                    id: contractId,
                },
                data: {
                    error: true,
                },
            });
            const errorData: ErrorData = {
                message: 'Communication failed with the secure model API.',
                error: 'Internal server error',
            };
            this.sendSSE(res, STAGE.ERROR, errorData, systemMessage);
            console.error('Gemini LLM Error:', llmError);
            throw llmError;
        }
    }

    private async generateClaudeStreamingResponse(
        res: Response,
        currentUserMessage: Message,
        messages: Message[],
        contractId: string,
        parser: StreamParser,
    ): Promise<string> {
        logger.info('claude llm used');
        const contents: ClaudeMessage[] = [];
        let fullResponse = '';

        try {
            const startingData: StartingData = {
                stage: 'starting',
                contractId: contractId,
                timestamp: Date.now(),
            };

            this.sendSSE(res, STAGE.START, startingData);

            for (const msg of messages) {
                if (msg.role === ChatRole.AI || msg.role === ChatRole.USER) {
                    contents.push({
                        role: msg.role === ChatRole.USER ? 'user' : 'assistant',
                        content: msg.content,
                    });
                }
            }

            contents.push({
                role: 'user',
                content: currentUserMessage.content,
            });

            const systemMessage = await prisma.message.create({
                data: {
                    contractId,
                    role: ChatRole.SYSTEM,
                    content: 'starting to generate in a few seconds',
                },
            });

            const stream = await this.claudeAI.messages.stream({
                model: 'claude-sonnet-4-5-20250929',
                max_tokens: 8096,
                system: this.systemPrompt,
                messages: contents,
            });

            for await (const event of stream) {
                if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
                    const text = event.delta.text;
                    fullResponse += text;
                    parser.feed(text, systemMessage);
                }
            }
            await this.saveLLMResponseToDb(fullResponse, contractId);
            return fullResponse;
        } catch (llmError) {
            const systemMessage = await prisma.message.update({
                where: {
                    id: contractId,
                },
                data: {
                    error: true,
                },
            });
            const errorData: ErrorData = {
                message: 'Communication failed with the secure model API.',
                error: 'Internal server error',
            };
            this.sendSSE(res, STAGE.ERROR, errorData, systemMessage);
            console.error('Claude LLM Error:', llmError);
            throw llmError;
        }
    }

    private async saveLLMResponseToDb(fullResponse: string, contractId: string): Promise<void> {
        try {
            await prisma.message.create({
                data: {
                    contractId,
                    role: ChatRole.AI,
                    content: fullResponse,
                },
            });
        } catch (error) {
            console.error('Error saving to database:', error);
        }
    }

    public createStream(res: Response): void {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('X-Accel-Buffering', 'no');
        res.flushHeaders();
    }

    private getParser(contractId: string, res: Response): StreamParser {
        if (!this.parsers.has(contractId)) {
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

            parser.on(PHASE_TYPES.ERROR, ({ data, systemMessage }) =>
                this.sendSSE(res, PHASE_TYPES.ERROR, data, systemMessage),
            );

            parser.on(STAGE.CONTEXT, ({ data, systemMessage }) =>
                this.sendSSE(res, STAGE.CONTEXT, data, systemMessage),
            );

            parser.on(STAGE.PLANNING, ({ data, systemMessage }) =>
                this.sendSSE(res, STAGE.PLANNING, data, systemMessage),
            );

            parser.on(STAGE.GENERATING_CODE, ({ data, systemMessage }) =>
                this.sendSSE(res, STAGE.GENERATING_CODE, data, systemMessage),
            );

            parser.on(STAGE.BUILDING, ({ data, systemMessage }) =>
                this.sendSSE(res, STAGE.BUILDING, data, systemMessage),
            );

            parser.on(STAGE.CREATING_FILES, ({ data, systemMessage }) =>
                this.sendSSE(res, STAGE.CREATING_FILES, data, systemMessage),
            );

            parser.on(STAGE.FINALIZING, ({ data, systemMessage }) =>
                this.sendSSE(res, STAGE.FINALIZING, data, systemMessage),
            );

            this.parsers.set(contractId, parser);
        }
        return this.parsers.get(contractId) as StreamParser;
    }

    private deleteParser(contractId: string): void {
        this.parsers.delete(contractId);
    }

    private sendSSE(
        res: Response,
        type: PHASE_TYPES | FILE_STRUCTURE_TYPES | STAGE,
        data: StreamEventData,
        systemMessage?: Message,
    ): void {
        const event: StreamEvent = {
            type,
            data,
            systemMessage: systemMessage as Message,
            timestamp: Date.now(),
        };

        res.write(`data: ${JSON.stringify(event)}\n\n`);
    }
}
