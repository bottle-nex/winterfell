import { GoogleGenAI } from '@google/genai';
import Anthropic from '@anthropic-ai/sdk';
import env from '../../configs/env';
import { Response } from 'express';
import { Chat, ChatRole, Message, prisma } from '@repo/database';
import StreamParser from '../../services/stream_parser';
import { SYSTEM_PROMPT } from '../../prompt/system';
import { objectStore } from '../../services/init';
import { logger } from '../../utils/logger';
import {
    FILE_STRUCTURE_TYPES,
    PHASE_TYPES,
    StartingData,
    StreamEvent,
    StreamEventData,
} from '../../types/stream_event_types';
import { STAGE } from '../../types/content_types';

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
        chat: Chat & { messages: Message[] },
        contractId: string,
        llmProvider: LLMProvider = 'gemini',
    ): Promise<void> {
        const parser = this.getParser(contractId, res);
        this.createStream(res);
        try {
            await this.generateStreamingResponse(
                res,
                currentUserMessage,
                chat,
                contractId,
                parser,
                llmProvider,
            );

            const generatedFiles = parser.getGeneratedFiles();
            this.sendSSE(res, STAGE.END, { data: generatedFiles });
            objectStore.uploadContractFiles(contractId, generatedFiles);
            if (generatedFiles.length > 0) {
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
        chat: Chat & { messages: Message[] },
        contractId: string,
        parser: StreamParser,
        llmProvider: LLMProvider = 'gemini',
    ): Promise<string> {
        if (llmProvider === 'claude') {
            return this.generateClaudeStreamingResponse(
                res,
                currentUserMessage,
                chat,
                contractId,
                parser,
            );
        } else {
            return this.generateGeminiStreamingResponse(
                res,
                currentUserMessage,
                chat,
                contractId,
                parser,
            );
        }
    }

    private async generateGeminiStreamingResponse(
        res: Response,
        currentUserMessage: Message,
        chat: Chat & { messages: Message[] },
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
                chatId: chat.id,
                contractId: contractId,
                timestamp: Date.now(),
            }

            this.sendSSE(res, STAGE.START, startingData);

            for (const msg of chat.messages) {
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
                model: 'gemini-2.0-flash-exp',
                contents,
            });

            let systemMessage = await prisma.message.create({
                data: {
                    chatId: chat.id,
                    role: ChatRole.SYSTEM,
                    content: 'starting to generate in a few seconds',
                },
            });

            for await (const chunk of response) {
                if (chunk.text) {
                    // console.log(chunk.text);
                    fullResponse += chunk.text;
                    parser.feed(chunk.text, systemMessage);
                }
            }

            await this.saveLLMResponseToDb(fullResponse, chat.id);
            return fullResponse;
        } catch (llmError) {
            console.error('Gemini LLM Error:', llmError);
            throw llmError;
        }
    }

    private async generateClaudeStreamingResponse(
        res: Response,
        currentUserMessage: Message,
        chat: Chat & { messages: Message[] },
        contractId: string,
        parser: StreamParser,
    ): Promise<string> {
        logger.info('claude llm used');
        const messages: ClaudeMessage[] = [];
        let fullResponse = '';

        try {
            const llm_message = await prisma.message.create({
                data: {
                    content:
                        'Understood. I will generate well-structured Anchor smart contracts with proper file organization, following all the specified guidelines.',
                    chatId: chat.id,
                    role: ChatRole.AI,
                },
            });

            const startingData: StartingData = {
                stage: 'starting',
                messageId: llm_message.id,
                chatId: chat.id,
                contractId: contractId,
                timestamp: Date.now(),
            };

            this.sendSSE(res, PHASE_TYPES.STARTING, startingData, llm_message);

            for (const msg of chat.messages) {
                if (msg.role === ChatRole.AI || msg.role === ChatRole.USER) {
                    messages.push({
                        role: msg.role === 'USER' ? 'user' : 'assistant',
                        content: msg.content,
                    });
                }
            }

            messages.push({
                role: 'user',
                content: currentUserMessage.content,
            });

            let systemMessage = await prisma.message.create({
                data: {
                    chatId: chat.id,
                    role: ChatRole.SYSTEM,
                    content: 'starting to generate in a few seconds',
                },
            });

            const stream = await this.claudeAI.messages.stream({
                model: 'claude-sonnet-4-5-20250929',
                max_tokens: 8096,
                system: this.systemPrompt,
                messages: messages,
            });

            for await (const event of stream) {
                if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
                    const text = event.delta.text;
                    fullResponse += text;
                    parser.feed(text, systemMessage);
                }
            }

            await this.saveLLMResponseToDb(fullResponse, chat.id);
            return fullResponse;
        } catch (llmError) {
            console.error('Claude LLM Error:', llmError);
            throw llmError;
        }
    }

    private async saveLLMResponseToDb(fullResponse: string, chatId: string): Promise<void> {
        try {
            await prisma.message.create({
                data: {
                    chatId: chatId,
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
        return this.parsers.get(contractId)!;
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
