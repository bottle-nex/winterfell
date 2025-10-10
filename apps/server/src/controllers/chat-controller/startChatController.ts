import { Request, Response } from "express";
import { prisma } from "@repo/database";
import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT } from "../../prompt/system";
import env from "../../configs/env";

const anthropic = new Anthropic({
    apiKey: env.SERVER_ANTHROPIC_API_KEY,
});

console.log(anthropic)

export default async function startChatController(req: Request, res: Response) {
    // if (!req.user?.id) {
    //     res.json({ error: "Not authenticated" });
    // }

    console.log("reached here");
    const userId = 'cmgjpnlpk0000ui7vipnp4msw';
    const chatId = req.query.chatId as string;
    const message = req.body.message as string;
    if (!chatId || chatId.length === 0 || typeof chatId !== 'string') {
        res.json({ error: "Invalid chatId" });
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
                    title: message, // focus someone ... this will be geneated by the llm
                    description: message,
                    contractType: "CUSTOM",
                    code: "", // Empty for now, will update after LLM
                    userId: String(userId),
                    version: 1,
                }
            })


            chat = await prisma.chat.create({
                data: {
                    userId: String(userId),
                    contractId: contract.id,
                }, include: {
                    contract: true,
                    messages: {
                        take: 20,
                        orderBy: {
                            createdAt: "asc"
                        }
                    }
                }
            })


        } else {
            chat = await prisma.chat.findUnique({
                where: {
                    id: chatId,
                }, include: {
                    messages: {
                        take: 20,
                        orderBy: {
                            createdAt: "asc"
                        }
                    },
                    contract: true
                }
            })

            if (!chat) {
                res.json({
                    error: "Chat not found"
                })
                return;
            }

            if (chat.userId !== String(userId)) {
                res.json({
                    error: "Unauthorized"
                })
                return;
            }

            contract = chat.contract;
        }

        console.log("contract", contract);
        console.log("chat", chat);

        const savedUserMessage = await prisma.message.create({
            data: {
                chatId: chat.id,
                role: "USER",
                content: message,
            },
        });

        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");
        res.flushHeaders();

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

            let llm_messages: Anthropic.MessageParam[] = chat.messages.map((c) => ({
                role: c.role === "USER" ? "user" : "assistant",
                content: c.content,
            }));

            llm_messages.push({
                role: "user",
                content: message,
            });

            const stream = await anthropic.messages.stream({
                model: "claude-sonnet-4-5-20250929",
                max_tokens: 4096,
                system: SYSTEM_PROMPT,
                messages: llm_messages,
            });

            for await (const chunk of stream) {
                if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
                    const content = chunk.delta.text;
                    res.write(
                        `data: ${JSON.stringify({
                            type: "chunk",
                            content: content,
                        })}\n\n`
                    );
                }
            }

        } catch (llmError) {
            console.error("LLM Error:", llmError);
            res.json({
                error: "Failed to generate response from AI",
            })
        }

    } catch (err) {

    }
}