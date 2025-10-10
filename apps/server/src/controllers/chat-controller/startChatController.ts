import { Request, Response } from "express";
import { ChatRole, prisma } from "@repo/database";
import { SYSTEM_PROMPT } from "../../prompt/system";
import env from "../../configs/env";
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
    apiKey: env.SERVER_GEMINI_API_KEY,
});

export default async function startChatController(req: Request, res: Response) {
    console.log("reached here");
    const userId = 'cmgjpnlpk0000ui7vipnp4msw';
    const chatId = req.query.chatId as string;
    const message = req.body.message as string;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
        res.status(400).json({ error: "Message is required" });
        return;
    }

    if (!chatId || chatId.length === 0 || typeof chatId !== 'string') {
        res.status(400).json({ error: "Invalid chatId" });
        return;
    }

    let chat;
    let contract;
    let isNewContract = false;

    if (!chatId || chatId === 'new') {
        isNewContract = true;
    }

    try {
        if (isNewContract) {
            contract = await prisma.contract.create({
                data: {
                    title: message.slice(0, 100),
                    description: message,
                    contractType: "CUSTOM",
                    code: "",
                    userId: String(userId),
                    version: 1,
                }
            });

            chat = await prisma.chat.create({
                data: {
                    userId: String(userId),
                    contractId: contract.id,
                },
                include: {
                    contract: true,
                    messages: {
                        take: 20,
                        orderBy: {
                            createdAt: "asc"
                        }
                    }
                }
            });
        } else {
            chat = await prisma.chat.findUnique({
                where: {
                    id: chatId,
                },
                include: {
                    messages: {
                        take: 20,
                        orderBy: {
                            createdAt: "asc"
                        }
                    },
                    contract: true
                }
            });

            if (!chat) {
                res.status(404).json({ error: "Chat not found" });
                return;
            }

            if (chat.userId !== String(userId)) {
                res.status(403).json({ error: "Unauthorized" });
                return;
            }

            contract = chat.contract;
        }

        // Step 2: Save user message to database
        const savedUserMessage = await prisma.message.create({
            data: {
                chatId: chat.id,
                role: "USER",
                content: message,
            },
        });

        // Step 3: Setup SSE headers for streaming
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");
        res.flushHeaders();

        // Send initial metadata
        res.write(
            `data: ${JSON.stringify({
                type: "start",
                messageId: savedUserMessage.id,
                chatId: chat.id,
                contractId: contract?.id,
                isNew: isNewContract,
            })}\n\n`
        );

        try {
            // Step 4: Use generateContentStream with full context
            // This is the CORRECT way - don't use ai.chats.create for history
            
            // Build the contents array with history + system prompt
            const contents = [];
            
            // Add system instruction as first user message
            contents.push({
                role: "user",
                parts: [{ text: SYSTEM_PROMPT }]
            });
            
            // Add a model acknowledgment
            contents.push({
                role: "model", 
                parts: [{ text: "Understood. I will help you create Anchor smart contracts following these guidelines." }]
            });
            
            // Add all previous messages from database
            for (const msg of chat.messages) {
                contents.push({
                    role: msg.role === "USER" ? "user" : "model",
                    parts: [{ text: msg.content }]
                });
            }
            
            // Add the current user message
            contents.push({
                role: "user",
                parts: [{ text: message }]
            });

            console.log("contents is : ", contents);

            // Step 5: Generate with streaming
            const stream = await ai.models.generateContentStream({
                model: "gemini-2.5-flash",
                contents: contents,
            });

            console.log("streams is : ", stream);

            let fullResponse = "";

            // Stream the response to client
            for await (const chunk of stream) {
                if (chunk.text) {
                    fullResponse += chunk.text;
                    console.log(chunk.text);
                    res.write(
                        `data: ${JSON.stringify({
                            type: "chunk",
                            content: chunk.text,
                        })}\n\n`
                    );
                }
            }

            // Step 6: Save assistant's response to database
            await prisma.message.create({
                data: {
                    chatId: chat.id,
                    role: ChatRole.AI,
                    content: fullResponse,
                },
            });

            // Step 7: Update contract code if response contains code
            if (fullResponse.includes("```rust") || fullResponse.includes("```")) {
                const codeMatch = fullResponse.match(/```(?:rust)?\n([\s\S]*?)```/);
                if (codeMatch && codeMatch[1]) {
                    await prisma.contract.update({
                        where: { id: contract.id },
                        data: { code: codeMatch[1].trim() }
                    });
                }
            }

            // Send completion event
            res.write(
                `data: ${JSON.stringify({
                    type: "done",
                    fullResponse: fullResponse,
                })}\n\n`
            );

            res.end();

        } catch (llmError) {
            console.error("LLM Error:", llmError);
            
            res.write(
                `data: ${JSON.stringify({
                    type: "error",
                    error: "Failed to generate response from AI",
                })}\n\n`
            );
            
            res.end();
        }

    } catch (err) {
        console.error("Controller Error:", err);
        
        if (!res.headersSent) {
            res.status(500).json({
                error: "Internal server error",
            });
        } else {
            res.write(
                `data: ${JSON.stringify({
                    type: "error",
                    error: "Internal server error",
                })}\n\n`
            );
            res.end();
        }
    }
}