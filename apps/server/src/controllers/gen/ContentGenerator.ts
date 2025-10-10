import { GoogleGenAI } from '@google/genai';
import env from '../../configs/env';
import { SYSTEM_PROMPT } from '../../prompt/system';
import { Response } from 'express';
import { Chat, ChatRole, Message, prisma } from '@repo/database';

enum ChatState {
    START,
    STREAMING,
    COMPLETE,
}

interface CtxObject {
    role: 'user' | 'model'
    parts: {
        text: string
    }[]
}

export default class ContentGenerator {
    public ai: GoogleGenAI;
    public system_prompt: string;

    constructor() {
        this.system_prompt = SYSTEM_PROMPT;
        this.ai = new GoogleGenAI({
            apiKey: env.SERVER_GEMINI_API_KEY,
        });
    }

    public async generate_initial_response(res: Response, message: Message, chat: Chat & { messages: Message[]}, contract_id: string) {
        this.generate_content_stream(res);
        res.write(
            `data: ${JSON.stringify({
                type: ChatState.START,
                messageId: message.id,
                chatId: chat.id,
                contractId: contract_id,
            })}\n\n`
        );

        const full_response = await this.generate_streaming_response(res, message, chat);
        if (full_response.includes("```rust") || full_response.includes("```")) {
            const codeMatch = full_response.match(/```(?:rust)?\n([\s\S]*?)```/);
            if (codeMatch && codeMatch[1]) {
                await prisma.contract.update({
                    where: { id: contract_id },
                    data: { code: codeMatch[1].trim() }
                });
            }
        }

        res.write(
            `data: ${JSON.stringify({
                type: "done",
                fullResponse: full_response,
            })}\n\n`
        );

        res.end();
    }

    public async generate_streaming_response(res: Response, message: Message, chat: Chat & { messages: Message[]}): Promise<string> {
        let contents: CtxObject[] = [];
        let full_response = "";

        try {
            contents.push({
                role: "user",
                parts: [{ text: this.system_prompt }]
            })
            contents.push({
                role: "model",
                parts: [{ text: "Understood. I will help you create Anchor smart contracts following these guidelines." }]
            });

            for (const msg of chat.messages) {
                contents.push({
                    role: msg.role === "USER" ? "user" : "model",
                    parts: [{ text: msg.content }]
                });
            }

            contents.push({
                role: "user",
                parts: [{ text: message.content }]
            });
            const response = await this.ai.models.generateContentStream({
                model: "gemini-2.5-flash",
                contents,
            })

            for await (const chunk of response) {
                if (chunk.text) {
                    full_response += chunk.text;
                }
            }
            this.save_llm_response_to_db(full_response, chat.id);
            return full_response;
        } catch (llm_error) {
            console.error("LLM Error:", llm_error);
            return ""
        }
    }

    private async save_llm_response_to_db(full_response: string, chat_id: string) {
        await prisma.message.create({
            data: {
                chatId: chat_id,
                role: ChatRole.AI,
                content: full_response
            }
        })
    }

    public generate_content_stream(res: Response) {
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");
        res.flushHeaders();
    }
}

