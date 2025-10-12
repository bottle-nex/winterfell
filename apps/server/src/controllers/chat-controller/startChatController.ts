import { Request, Response } from 'express';
import { prisma } from '@repo/database';
import { contentGenerator } from '../../services/init';

export default async function startChatController(req: Request, res: Response) {
    const userId = 'cmgjpnlpk0000ui7vipnp4msw';
    const chatId = req.query.chatId as string;
    const message = req.body.message as string;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
        res.status(400).json({ error: 'Message is required' });
        return;
    }

    if (!chatId || chatId.length === 0 || typeof chatId !== 'string') {
        res.status(400).json({ error: 'Invalid chatId' });
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
                    contractType: 'CUSTOM',
                    code: '',
                    userId: String(userId),
                    version: 1,
                },
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
                            createdAt: 'asc',
                        },
                    },
                },
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
                            createdAt: 'asc',
                        },
                    },
                    contract: true,
                },
            });

            if (!chat) {
                res.status(404).json({ error: 'Chat not found' });
                return;
            }

            if (chat.userId !== String(userId)) {
                res.status(403).json({ error: 'Unauthorized' });
                return;
            }

            contract = chat.contract;
        }

        const currentUserMessage = await prisma.message.create({
            data: {
                chatId: chat.id,
                role: 'USER',
                content: message,
            },
        });

        await contentGenerator.generate_initial_response(
            res,
            currentUserMessage,
            chat,
            contract?.id,
        );
    } catch (err) {
        console.error('Controller Error:', err);

        if (!res.headersSent) {
            res.status(500).json({
                error: 'Internal server error',
            });
        } else {
            res.write(
                `data: ${JSON.stringify({
                    type: 'error',
                    error: 'Internal server error',
                })}\n\n`,
            );
            res.end();
        }
    }
}
