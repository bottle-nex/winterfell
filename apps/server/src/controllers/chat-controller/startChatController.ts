import { Request, Response } from 'express';
import { prisma } from '@repo/database';
import { contentGenerator } from '../../services/init';

export default async function startChatController(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    const chatId = req.body.chatId as string;
    const message = req.body.message as string;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
        res.status(400).json({ error: 'Message is required' });
        return;
    }

    if (!chatId || typeof chatId !== 'string') {
        res.status(400).json({ error: 'Invalid chatId' });
        return;
    }

    try {
        let chat = await prisma.chat.findUnique({
            where: { id: chatId },
            include: {
                messages: {
                    orderBy: { createdAt: 'asc' },
                },
                contract: true,
            },
        });

        let contract;

        if (!chat) {
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
                    id: chatId,
                    userId: String(userId),
                    contractId: contract.id,
                },
                include: {
                    contract: true,
                    messages: {
                        orderBy: { createdAt: 'asc' },
                    },
                },
            });
        } else {
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

        await contentGenerator.generateInitialResponse(
            res,
            currentUserMessage,
            chat,
            contract.id,
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
