interface AuthUser {
    id: string;
    name: string;
    email: string;
}

declare namespace Express {
    export interface Request {
        user?: AuthUser;
    }
}
