
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '@repo/database';

const SERVER_JWT_SECRET = process.env.SERVER_JWT_SECRET;

export default async function signInController(req: Request, res: Response) {
    const { user, account } = req.body;

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
        });

        let myUser;
        const isGithub = account.provider === 'github';

        if (existingUser) {
            const updateData: any = {
                name: user.name,
                image: user.image,
            };

            const providers = existingUser.provider?.split(',') || [];
            if (!providers.includes(account.provider)) {
                providers.push(account.provider);
                updateData.provider = providers.join(',');
            }

            if (isGithub) {
                updateData.githubAccessToken = account.access_token;
                updateData.githubUsername = account.providerAccountId;
            }

            myUser = await prisma.user.update({
                where: { email: user.email },
                data: updateData,
            });
        } else {
            myUser = await prisma.user.create({
                data: {
                    name: user.name,
                    email: user.email,
                    image: user.image,
                    provider: account.provider,
                    githubAccessToken: isGithub ? account.access_token : null,
                    githubUsername: isGithub ? account.providerAccountId : null,
                },
            });
        }

        // Generate JWT with GitHub info if available
        const jwtPayload = {
            id: myUser.id,
            email: myUser.email,
            name: myUser.name,
        };

        if (!SERVER_JWT_SECRET) {
            return res.status(500).json({
                success: false,
                message: 'Server error',
            });
        }

        const token = jwt.sign(jwtPayload, SERVER_JWT_SECRET, { expiresIn: '30d' });

        return res.json({
            success: true,
            user: {
                id: myUser.id,
                name: myUser.name,
                email: myUser.email,
                image: myUser.image,
                provider: myUser.provider,
                hasGithub: !!myUser.githubAccessToken,
                githubUsername: myUser.githubUsername,
            },
            token,
        });
    } catch (err) {
        console.error('SignIn error:', err);
        return res.status(500).json({
            success: false,
            error: 'Authentication failed',
        });
    }
}
