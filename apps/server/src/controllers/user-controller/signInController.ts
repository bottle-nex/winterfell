import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '@repo/database';

const SERVER_JWT_SECRET = process.env.SERVER_JWT_SECRET;

export default async function signInController(req: Request, res: Response) {
    const { user, account } = req.body;

    console.log('SignIn Request Body:', JSON.stringify({ user, account }, null, 2));

    if (!user || !user.email) {
        console.error('Missing user or user.email');
        return res.status(400).json({
            success: false,
            error: 'Missing user email',
        });
    }

    if (!account || !account.provider) {
        console.error('Missing account or account.provider');
        return res.status(400).json({
            success: false,
            error: 'Missing account provider',
        });
    }

    if (!SERVER_JWT_SECRET) {
        console.error('SERVER_JWT_SECRET is not defined');
        return res.status(500).json({
            success: false,
            error: 'Server configuration error',
        });
    }

    try {
        console.log('Looking up user with email:', user.email);

        const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
        });

        console.log('Existing user found:', !!existingUser);

        let myUser;
        const isGithub = account.provider === 'github';

        if (existingUser) {
            console.log('Updating existing user');

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
                updateData.githubId = account.providerAccountId; // GitHub user ID
                updateData.githubUsername = account.providerAccountId; // Or use profile.login if available
            }

            myUser = await prisma.user.update({
                where: { email: user.email },
                data: updateData,
            });

            console.log('User updated successfully');
        } else {
            console.log('Creating new user');

            myUser = await prisma.user.create({
                data: {
                    name: user.name,
                    email: user.email,
                    image: user.image,
                    provider: account.provider,
                    githubAccessToken: isGithub ? account.access_token : null,
                    githubId: isGithub ? account.providerAccountId : null,
                    githubUsername: isGithub ? account.providerAccountId : null,
                },
            });

            console.log('User created successfully');
        }

        // Generate JWT
        const jwtPayload = {
            id: myUser.id, // Already a string (cuid)
            email: myUser.email,
            name: myUser.name,
        };

        console.log('Generating JWT token for user ID:', myUser.id);
        const token = jwt.sign(jwtPayload, SERVER_JWT_SECRET, { expiresIn: '30d' });

        const response = {
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
        };

        console.log('SignIn successful for user:', myUser.email);
        return res.json(response);
    } catch (err) {
        console.error('SignIn error - Full details:');
        console.error('Error name:', err instanceof Error ? err.name : 'Unknown');
        console.error('Error message:', err instanceof Error ? err.message : err);
        console.error('Error stack:', err instanceof Error ? err.stack : 'No stack trace');

        // Log Prisma-specific errors
        if (err && typeof err === 'object' && 'code' in err) {
            console.error('Prisma error code:', (err as any).code);
            console.error('Prisma meta:', (err as any).meta);
        }

        return res.status(500).json({
            success: false,
            error: 'Authentication failed',
            details:
                process.env.NODE_ENV === 'development'
                    ? err instanceof Error
                        ? err.message
                        : String(err)
                    : undefined,
        });
    }
}
