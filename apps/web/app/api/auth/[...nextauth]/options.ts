import { Account, AuthOptions, ISODateString } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import { JWT } from 'next-auth/jwt';
import axios from 'axios';
import { SIGNIN_URL } from '@/routes/api_routes';

export interface UserType {
    id?: string | null;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    provider?: string | null;
    token?: string | null;
    hasGithub?: boolean;
    githubUsername?: string | null;
}

export interface CustomSession {
    user?: UserType;
    expires: ISODateString;
}

export const authOption: AuthOptions = {
    pages: {
        signIn: '/',
    },
    session: {
        strategy: 'jwt',
    },
    callbacks: {
        async signIn({ user, account }: { user: UserType; account: Account | null }) {
            try {
                if (account?.provider === 'google' || account?.provider === 'github') {
                    const response = await axios.post(`${SIGNIN_URL}`, {
                        user,
                        account,
                    });
                    const result = response.data;
                    console.log('response from backend is -----------------> ', response.data);
                    if (result?.success) {
                        user.id = result.user.id;
                        user.token = result.token;
                        user.hasGithub = result.user.hasGithub;
                        user.githubUsername = result.user.githubUsername;
                        return true;
                    }
                }
                return false;
            } catch (err) {
                console.error('SignIn error:', err);
                return false;
            }
        },
        async jwt({ token, user }) {
            if (user) {
                token.user = user as UserType;
            }
            return token;
        },
        async session({ session, token }: { session: CustomSession; token: JWT }) {
            session.user = token.user as UserType;
            return session;
        },
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
            authorization: {
                params: {
                    prompt: 'consent',
                    access_type: 'offline',
                    response_type: 'code',
                },
            },
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID || '',
            clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
            authorization: {
                params: {
                    scope: 'repo user',
                },
            },
        }),
    ],
};
