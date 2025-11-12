import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '@repo/database';
import ResponseWriter from '../../class/response_writer';

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

            const providers = existingUser.provider?.split(',').filter(Boolean) || [];
            const isNewProvider = !providers.includes(account.provider);

            const updateData: any = {
                name: user.name || existingUser.name,
                image: user.image || existingUser.image,
            }

            if (isNewProvider) {
                providers.push(account.provider);
                updateData.provider = providers.join(',');
            }

            if (isGithub) {
                const githubAlreadyConnectedToExistingEmail = await prisma.user.findFirst({
                    where: {
                        githubUsername: account.providerAccountId,
                        NOT: {
                            email: user.email,
                        },
                    },
                });

                if (githubAlreadyConnectedToExistingEmail) {
                    ResponseWriter.error(res, 'GitHub already connected to other email', 400);
                    return;
                }

                updateData.githubAccessToken = account.access_token;
                updateData.githubUsername = account.providerAccountId;
                updateData.githubId = account.providerAccountId;
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
                    githubId: isGithub ? account.providerAccountId : null,
                    githubAccessToken: isGithub ? account.access_token : null,
                    githubUsername: isGithub ? (account.login || account.providerAccountId) : null,
                },
            });
        }

        const jwtPayload = {
            id: myUser.id,
            email: myUser.email,
            name: myUser.name,
            githubAccessToken: myUser.githubAccessToken || null,
            githubUsername: myUser.githubUsername || null,
        };

        if (!SERVER_JWT_SECRET) {
            ResponseWriter.server_error(res, 'Server error');
            return;
        }

        const token = jwt.sign(jwtPayload, SERVER_JWT_SECRET, { expiresIn: '30d' });
        ResponseWriter.success(
            res,
            {
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
            },
            'Sign In succeded',
            200
        );
        return;

    } catch (err) {
        console.error('SignIn error:', err);
        ResponseWriter.error(res, 'Authentication failed', 500);
        return;
    }
}
