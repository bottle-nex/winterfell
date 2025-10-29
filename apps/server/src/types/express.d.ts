export interface AuthUser {
    id: string;
    name: string;
    email: string;
    githubAccessToken?: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: AuthUser;
        }
    }
}
