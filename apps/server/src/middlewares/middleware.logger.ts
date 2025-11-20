import { Request, Response, NextFunction } from 'express';
import { trace, SpanStatusCode } from '@opentelemetry/api';
import { logger } from '../utils/logger';

export const loggingMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();

    logger.logRequest(req);

    const originalSend = res.send;

    res.send = function (data: any) {
        const duration = Date.now() - startTime;

        // logger.logResponse(req, res, duration);

        const activeSpan = trace.getActiveSpan();
        if (activeSpan) {
            activeSpan.setAttributes({
                'http.method': req.method,
                'http.url': req.url,
                'http.status_code': res.statusCode,
                'http.duration_ms': duration,
            });

            if (res.statusCode >= 400) {
                activeSpan.setStatus({
                    code: SpanStatusCode.ERROR,
                    message: `HTTP ${res.statusCode}`,
                });
            }
        }

        return originalSend.call(this, data);
    };

    next();
};
