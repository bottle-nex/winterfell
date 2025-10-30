import { Request, Response } from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { prisma } from '@repo/database';
import env from '../../configs/env';

export default async function githubConnectController(req: Request, res: Response) {
    const userId = req.user?.id;
    const { code } = req.body;

    if (!userId) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized',
        });
    }

    if (!code) {
        return res.status(400).json({
            success: false,
            message: 'Authorization code is required',
        });
    }

    try {
        const tokenResponse = await axios.post(
            'https://github.com/login/oauth/access_token',
            {
                client_id: env.GITHUB_CLIENT_ID,
                client_secret: env.GITHUB_CLIENT_SECRET,
                code: code,
            },
            {
                headers: { Accept: 'application/json' },
            },
        );

        const githubAccessToken = tokenResponse.data.access_token;

        if (!githubAccessToken) {
            return res.status(400).json({
                success: false,
                message: 'Failed to get GitHub access token',
            });
        }

        const githubUserResponse = await axios.get('https://api.github.com/user', {
            headers: { Authorization: `Bearer ${githubAccessToken}` },
        });

        const githubUsername = githubUserResponse.data.login;

        // Update user in database
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        const providers = user.provider?.split(',') || [];
        if (!providers.includes('github')) {
            providers.push('github');
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                githubAccessToken,
                githubUsername,
                provider: providers.join(','),
            },
        });

        const jwtPayload = {
            id: updatedUser.id,
            email: updatedUser.email,
            name: updatedUser.name,
            githubAccessToken: updatedUser.githubAccessToken,
        };

        if (!env.SERVER_JWT_SECRET) {
            return res.status(500).json({
                success: false,
                message: 'Server error',
            });
        }

        const newToken = jwt.sign(jwtPayload, env.SERVER_JWT_SECRET, { expiresIn: '30d' });

        return res.status(200).json({
            success: true,
            message: 'GitHub connected successfully',
            token: newToken,
            hasGithub: true,
            githubUsername,
        });
    } catch (error) {
        console.error('GitHub connect error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to connect GitHub',
        });
    }
}
