import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '@repo/database';
import { logger } from '../../utils/logger';

const SERVER_JWT_SECRET = process.env.SERVER_JWT_SECRET;

export default async function signInController(req: Request, res: Response) {
    const { user, account } = req.body;

    try {
        const provider = account?.provider;
        const githubAccessToken = account?.provider === 'github' ? account.access_token : null;

        const existingUser = await prisma.user.findUnique({
            where: {
                email: user.email,
            },
        });

        let myUser;
        if (existingUser) {
            const updateData = {
                name: user.name,
                email: user.email,
                image: user.image,
                provider,
                ...(githubAccessToken && { githubAccessToken }),
            };

            myUser = await prisma.user.update({
                where: {
                    email: user.email,
                },
                data: updateData,
            });
        } else {
            myUser = await prisma.user.create({
                data: {
                    name: user.name,
                    email: user.email,
                    image: user.image,
                    provider,
                    githubAccessToken: githubAccessToken,
                },
            });
        }

        const jwtPayload = {
            name: myUser.name,
            email: myUser.email,
            id: myUser.id,
            provider: myUser.provider,
        };

        const secret = SERVER_JWT_SECRET;
        if (!secret) {
            res.status(500).json({
                message: 'Server error',
            });
            return;
        }

        const token = jwt.sign(jwtPayload, secret);

        res.json({
            success: true,
            user: {
                ...myUser,
            },
            token: token,
        });
        return;
    } catch (err) {
        logger.error('Authentication error:', err);
        res.status(500).json({
            success: false,
            error: 'Authentication failed',
        });
        return;
    }
}
