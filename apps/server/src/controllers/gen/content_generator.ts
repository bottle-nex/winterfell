import { GoogleGenAI } from '@google/genai';
import Anthropic from '@anthropic-ai/sdk';
import env from '../../configs/config.env';
import { Response } from 'express';
import { ChatRole, Message, prisma } from '@repo/database';
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
import re_stating_prompt from '../../prompt/re-stating-prompt';
// import re_stating_prompt from '../../prompt/re-stating-prompt';

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
    private parsers: Map<string, StreamParser>;

    constructor() {
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
        public_key: string,
        llmProvider: LLMProvider = 'gemini',
        userInstruction?: string,
    ): Promise<void> {
        const isFirstMessage = await this.isFirstMessage(contractId);

        const parser = this.getParser(contractId, res);
        this.createStream(res);

        try {
            const full_response = await this.generateStreamingResponse(
                res,
                currentUserMessage,
                messages,
                contractId,
                parser,
                public_key,
                isFirstMessage.bool,
                isFirstMessage.fetched_contract,
                userInstruction || '',
                llmProvider,
            );
            const llmGeneratedFiles: FileContent[] = parser.getGeneratedFiles();
            const contractName: string = parser.getContractName() || isFirstMessage.name;
            const base_files: FileContent[] = prepareBaseTemplate(contractName);
            const final_code = mergeWithLLMFiles(base_files, llmGeneratedFiles);

            await this.saveLLMResponseToDb(llmGeneratedFiles, contractId);
            const existing = await prisma.contract.findUnique({
                where: { id: contractId },
            });
            if (!existing) {
                console.error('contract id not found');
            }

            await prisma.contract.update({
                where: {
                    id: contractId,
                },
                data: {
                    title: contractName,
                },
            });

            this.sendSSE(res, STAGE.END, { data: final_code });
            objectStore.uploadContractFiles(contractId, final_code, full_response);

            if (llmGeneratedFiles.length > 0) {
                this.deleteParser(contractId);
                res.end();
            } else {
                throw new Error('No files were generated');
            }
        } catch {
            logger.error('Error in generateInitialResponse:');
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
        public_key: string,
        isFirstMessage: boolean,
        code_base: string,
        userInstruction: string,
        llmProvider: LLMProvider = 'gemini',
    ): Promise<string> {
        if (llmProvider === 'claude') {
            return await this.generateClaudeStreamingResponse(
                res,
                currentUserMessage,
                messages,
                contractId,
                parser,
                public_key,
                isFirstMessage,
                code_base,
                userInstruction,
            );
        } else {
            return await this.generateGeminiStreamingResponse(
                res,
                currentUserMessage,
                messages,
                contractId,
                parser,
                public_key,
                isFirstMessage,
                code_base,
                userInstruction,
            );
        }
    }

    private async generateGeminiStreamingResponse(
        res: Response,
        currentUserMessage: Message,
        messages: Message[],
        contractId: string,
        parser: StreamParser,
        public_key: string,
        isFirstMessage: boolean,
        code_base: string,
        userInstruction: string,
    ): Promise<string> {
        console.log('gemini llm used');
        const contents: GeminiMessage[] = [];
        let fullResponse = '';

        let systemPrompt;
        if (isFirstMessage) {
            systemPrompt = SYSTEM_PROMPT(public_key);
        } else {
            systemPrompt = re_stating_prompt(userInstruction, code_base);
        }

        try {
            contents.push({
                role: 'user',
                parts: [{ text: systemPrompt }],
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
        public_key: string,
        isFirstMessage: boolean,
        code_base: string,
        userInstruction: string,
    ): Promise<string> {
        console.log('claude llm used');
        const contents: ClaudeMessage[] = [];
        let fullResponse = '';

        let systemPrompt;
        if (isFirstMessage) {
            systemPrompt = SYSTEM_PROMPT(public_key);
        } else {
            systemPrompt = re_stating_prompt(userInstruction, code_base);
        }

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
                system: systemPrompt,
                messages: contents,
            });

            for await (const event of stream) {
                if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
                    const text = event.delta.text;
                    fullResponse += text;
                    parser.feed(text, systemMessage);
                }
            }
            return fullResponse;
        } catch (llmError) {
            const systemMessage = await prisma.message.findFirst({
                where: {
                    contractId,
                    role: ChatRole.SYSTEM,
                },
                orderBy: {
                    createdAt: 'desc',
                },
            });

            if (systemMessage) {
                await prisma.message.update({
                    where: {
                        id: systemMessage.id,
                    },
                    data: {
                        error: true,
                    },
                });
            }

            const errorData: ErrorData = {
                message: 'Communication failed with the secure model API.',
                error: 'Internal server error',
            };

            this.sendSSE(res, STAGE.ERROR, errorData, systemMessage || undefined);
            console.error('Claude LLM Error:', llmError);
            throw llmError;
        }
    }

    private async saveLLMResponseToDb(code: FileContent[], contractId: string): Promise<void> {
        try {
            await prisma.contract.update({
                where: { id: contractId },
                data: {
                    code: JSON.stringify(code),
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

    private async isFirstMessage(contractId: string): Promise<{
        bool: boolean;
        fetched_contract: string;
        name: string;
    }> {
        const contract = await prisma.contract.findUnique({
            where: { id: contractId },
            select: {
                messages: true,
                title: true,
            },
        });

        const system_messages = contract?.messages.filter((m) => m.role === 'SYSTEM');

        // If no messages found → it's the first message
        if (
            !contract ||
            !contract.messages ||
            contract.messages.length === 0 ||
            !system_messages ||
            system_messages.length === 0
        ) {
            return {
                bool: true,
                fetched_contract: '',
                name: '',
            };
        }

        // Otherwise, fetch the existing contract code using Fetch API
        const contract_url = `${env.SERVER_CLOUDFRONT_DOMAIN}/${contractId}/resource`;

        const response = await fetch(contract_url);
        if (!response.ok) {
            throw new Error(`Failed to fetch contract: ${response.statusText}`);
        }

        const fetched_contract = await response.text();

        return {
            bool: false,
            fetched_contract,
            name: contract.title,
        };
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
