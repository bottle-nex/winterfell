import { Request, Response } from "express";
import { continueChatSchema } from "../../schemas/continue_chat_schema";
import { ChatRole, prisma } from "@repo/database";
import { contentGenerator } from "../../services/init";


export default async function continueChatController(req: Request, res: Response) {
    try {

        const user = req.user;
        if(!user) {
            res.status(401).json({
                success: false,
                message: 'Unauthorized',
            });
            return;
        }

        const data = continueChatSchema.safeParse(req.body);
        if(!data.success) {
            res.status(400).json({
                success: false,
                message: 'Invalid data',
            });
            return;
        }

        const { contractId, instruction } = data.data;

        const existingContract = await prisma.contract.findUnique({
            where: {
                id: contractId,
            },
            include: {
                messages: {
                    orderBy: {
                        createdAt: 'asc',
                    },
                },
            },
        });

        if(!existingContract) {
            res.status(400).json({
                success: false,
                message: 'contract not found',
            });
            return;
        }

        const currentUserMessage = await prisma.message.create({
            data: {
                role: ChatRole.USER,
                content: instruction,
                contractId: contractId,
            },
        });

        await contentGenerator.generateInitialResponse(
            res,
            currentUserMessage,
            existingContract.messages,
            contractId,
            instruction,
        );
        
    } catch (error) {
        console.error('continue chat controller error:', error);
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