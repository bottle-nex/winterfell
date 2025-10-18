import { NextFunction, Request, Response } from 'express';
import env from '../configs/env';
import jwt from 'jsonwebtoken';

export default function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer')) {
        res.status(401).json({
            success: false,
            message: 'Unauthorized',
        });
        return;
    }

    const token = authHeader.split(' ')[1];
    const secret = env.SERVER_JWT_SECRET;

    if (!secret) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
        return;
    }

    if (!token) {
        res.status(404).json({
            success: false,
            message: 'Token not found',
        });
        return;
    }
    try {
        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                res.status(401).json({
                    success: false,
                    message: 'Unauthorized',
                });
                return;
            }
            req.user = decoded as AuthUser;
            next();
        });
    } catch (error) {
        console.error('Error in auth middleware: ', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
        return;
    }
}
