import { prisma } from '@repo/database';
import { Request, Response } from 'express';
import env from '../../configs/config.env';

export default async function (req: Request, res: Response) {
    try {
        const user = req.user;

        if (!user) {
            res.status(401).json({
                success: false,
                message: 'Unauthorized',
            });
            return;
        }

        const { contractId } = req.body;

        if (!contractId) {
            res.status(400).json({
                success: false,
                message: 'chat-id not found!',
            });
            return;
        }

        const contract = await prisma.contract.findUnique({
            where: {
                id: contractId,
                userId: user.id,
            },
            select: {
                id: true,
                title: true,
                description: true,
                code: true,
                summary: true,
                deployed: true,
                programId: true,
                version: true,
                createdAt: true,
                messages: {
                    select: {
                        id: true,
                        role: true,
                        content: true,
                        planning: true,
                        generatingCode: true,
                        building: true,
                        creatingFiles: true,
                        finalzing: true,
                        error: true,
                        createdAt: true,
                    },
                    orderBy: {
                        createdAt: 'asc',
                    },
                },
            },
        });

        if (!contract) {
            res.status(404).json({
                success: false,
                messsage: `contract with id: ${contractId} was not found!`,
            });
            return;
        }

        const sortedMessages = [...contract.messages].sort(
            (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
        );

        // this is the latest system message
        const latestMessage = sortedMessages.find(
            (m) => m.role === 'SYSTEM' && m.finalzing && !m.error,
        );

        if (!latestMessage) {
            throw new Error('system message not found');
        }

        if (latestMessage.error) {
            res.status(200).json({
                success: true,
                message: 'contract generation threw an error',
                latestMessage: latestMessage,
                messages: contract.messages,
                contract: contract,
            });
            return;
        }

        if (latestMessage.finalzing) {
            const contract_url = `${env.SERVER_CLOUDFRONT_DOMAIN}/${contractId}/resource`;
            const response = await fetch(contract_url);
            if (!response.ok) {
                throw new Error(`Failed to fetch contract: ${response.statusText}`);
            }

            const contractFiles = await response.text();

            res.status(200).json({
                success: true,
                latestMessage: latestMessage,
                message: 'fetched contract files',
                messages: contract.messages,
                contract: contract,
                contractFiles: contractFiles,
            });
            return;
        }

        res.status(200).json({
            success: true,
            latestMessage: latestMessage,
            message: 'chat fetched successfully',
            messages: contract.messages,
            contract: contract,
        });
        return;
    } catch (error) {
        console.error('Error while fetching chat data: ', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
        return;
    }
}
