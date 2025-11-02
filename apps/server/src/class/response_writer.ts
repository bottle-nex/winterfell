import { Response } from 'express';

interface ApiResponse<T = unknown> {
    success?: boolean;
    data?: T;
    message?: string;
    error?: {
        code: string;
        details?: string;
    };
    meta: {
        timestamp: string;
        [key: string]: unknown;
    };
}

export default class ResponseWriter {
    static success<T>(res: Response, data: T, message: string, status_code: number): void {
        const response: ApiResponse<T> = {
            success: true,
            data,
            message,
            meta: {
                timestamp: new Date().toISOString(),
            },
        };
        res.status(status_code).json(response);
    }

    static created<T>(res: Response, data: T, message: string, status_code: number = 201): void {
        this.success(res, data, message || 'resource created successfully', status_code);
    }

    static no_content(res: Response): void {
        res.status(204).send();
    }

    static error(
        res: Response,
        message: string,
        statusCode: number = 500,
        errorCode?: string,
        details?: string,
    ): void {
        const response: ApiResponse<unknown> = {
            success: false,
            message,
            error: {
                code: errorCode || `ERROR_${statusCode}`,
                details,
            },
            meta: {
                timestamp: new Date().toISOString(),
            },
        };
        res.status(statusCode).json(response);
    }

    static unauthorized(res: Response, message: string = 'Unauthorized access'): void {
        this.error(res, message, 401, 'UNAUTHORIZED');
    }

    static not_found(res: Response, message: string = 'Resource not found'): void {
        this.error(res, message, 404, 'NOT_FOUND');
    }

    static validation_error(
        res: Response,
        errors: string,
        message: string = 'Validation failed',
    ): void {
        this.error(res, message, 422, 'VALIDATION_ERROR', errors);
    }

    static server_error(
        res: Response,
        message: string = 'Internal server error',
        details?: string,
    ): void {
        this.error(res, message, 500, 'INTERNAL_SERVER_ERROR', details);
    }

    static custom<T>(res: Response, statusCode: number, response: ApiResponse<T>): void {
        res.status(statusCode).json({
            ...response,
            meta: {
                ...response.meta,
                timestamp: new Date().toISOString(),
            },
        });
    }
}
