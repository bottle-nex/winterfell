import { prisma } from "@repo/database";
import { Request, Response } from "express";

export default async function(req: Request, res: Response) {
    try {

        const user = req.user;

        if(!user) {
            res.status(401).json({
                success: false,
                message: 'Unauthorized',
            });
            return;
        }

        const { chatId } = req.body;

        if(!chatId) {
            res.status(400).json({
                success: false,
                message: 'chat-id not found!',
            });
            return;
        }

        const chat = await prisma.chat.findUnique({
            where: {
                id: chatId,
                userId: user.id,
            },
            select: {
                contract: {
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
                    }
                },
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
                        createdAt: 'desc',
                    },
                },
            },
        });

        if(!chat) {
            res.status(404).json({
                success: false,
                message: `chat with id: ${chatId} was not found!`,
            });
            return;
        }

        if(!chat.contract) {
            res.status(200).json({
                success: true,
                message: 'contract not created yet',
                messages: chat.messages,
            });
            return;
        }
        
        const latestMessage = chat.messages[0];

        const code = chat.contract.code;
        // call s3 client to get the code base and return that code to the user
        // update the code to the fetched code base, and don't send the s3 url

        // const codeBase = s3client.getCode(contractId);
        // chat.contract.code = codeBase;
        
        res.status(200).json({
            success: true,
            message: 'chat fetched successfully',
            messages: chat.messages,
            contract: chat.contract
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