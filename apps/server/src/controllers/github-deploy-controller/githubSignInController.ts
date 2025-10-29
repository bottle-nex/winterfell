import { Request, Response } from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { prisma } from '@repo/database';

const SERVER_JWT_SECRET = process.env.SERVER_JWT_SECRET;
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

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
        // Exchange code for access token
        const tokenResponse = await axios.post(
            'https://github.com/login/oauth/access_token',
            {
                client_id: GITHUB_CLIENT_ID,
                client_secret: GITHUB_CLIENT_SECRET,
                code: code,
            },
            {
                headers: { Accept: 'application/json' },
            }
        );

        const githubAccessToken = tokenResponse.data.access_token;

        if (!githubAccessToken) {
            return res.status(400).json({
                success: false,
                message: 'Failed to get GitHub access token',
            });
        }

        // Get GitHub user info
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

        // Append "github" to provider if not already there
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

        // Generate new JWT with GitHub token
        const jwtPayload = {
            id: updatedUser.id,
            email: updatedUser.email,
            name: updatedUser.name,
            githubAccessToken: updatedUser.githubAccessToken,
        };

        if (!SERVER_JWT_SECRET) {
            return res.status(500).json({
                success: false,
                message: 'Server error',
            });
        }

        const newToken = jwt.sign(jwtPayload, SERVER_JWT_SECRET, { expiresIn: '30d' });

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