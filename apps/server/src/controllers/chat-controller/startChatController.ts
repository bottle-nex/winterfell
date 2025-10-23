import { Request, Response } from 'express';
import { ChatRole, prisma } from '@repo/database';
import { contentGenerator } from '../../services/init';
import { startChatSchema } from '../../schemas/start_chat_schema';

export default async function startChatController(req: Request, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    const data = startChatSchema.safeParse(req.body);
    if (!data.success) {
        res.status(400).json({ error: 'Invalid request' + data.error });
        return;
    }

    const { contractId, message } = data.data;
    try {
        let contract;
        contract = await prisma.contract.findUnique({
            where: { id: contractId, userId: userId },
            include: {
                messages: {
                    orderBy: { createdAt: 'asc' },
                },
            },
        });

        if (!contract) {
            contract = await prisma.contract.create({
                data: {
                    title: '',
                    contractType: 'CUSTOM',
                    userId: userId,
                },
                include: {
                    messages: {
                        orderBy: { createdAt: 'asc' },
                    },
                },
            });
        }

        const currentUserMessage = await prisma.message.create({
            data: {
                role: ChatRole.USER,
                content: message,
                contractId: contract.id,
            },
        });

        await contentGenerator.generateInitialResponse(
            res,
            currentUserMessage,
            contract.messages,
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
