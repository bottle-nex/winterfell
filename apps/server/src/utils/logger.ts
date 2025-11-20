import winston from 'winston';
import { logs, SeverityNumber } from '@opentelemetry/api-logs';
import { trace } from '@opentelemetry/api';
import { Request, Response } from 'express';

interface LogAttributes {
    [key: string]: unknown;
}

const severityMap: Record<string, SeverityNumber> = {
    error: SeverityNumber.ERROR,
    warn: SeverityNumber.WARN,
    info: SeverityNumber.INFO,
    debug: SeverityNumber.DEBUG,
};

export default class Logger {
    private winston_logger: any;
    private otlp_logger: any;

    constructor() {
        this.create_winston_logger();
        this.init_otlp_logger();
    }

    private init_otlp_logger() {
        this.otlp_logger = logs.getLogger('winterfell-api-service', '1.0.0');
    }

    private create_winston_logger() {
        this.winston_logger = winston.createLogger({
            level: 'info',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.errors({ stack: true }),
                winston.format.colorize(),
                winston.format.printf(({ timestamp, level, message, ...meta }) => {
                    const metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
                    return `${timestamp} [${level}]: ${message} ${metaStr}`;
                }),
            ),
            transports: [new winston.transports.Console()],
        });
    }

    private logToOtel(level: string, message: string, attributes: LogAttributes = {}) {
        const activeSpan = trace.getActiveSpan();
        console.log('trace id is : ', activeSpan?.spanContext().traceId);
        this.otlp_logger.emit({
            severityNumber: severityMap[level] || SeverityNumber.INFO,
            severityText: level.toUpperCase(),
            body: message,
            attributes: {
                ...attributes,
                ...(activeSpan && {
                    trace_id: activeSpan.spanContext().traceId,
                    span_id: activeSpan.spanContext().spanId,
                }),
            },
        });
    }

    public info(message: string, attributes: LogAttributes = {}) {
        this.winston_logger.info(message, attributes);
        this.logToOtel('info', message, attributes);
    }

    public error(message: string, attributes: LogAttributes = {}) {
        this.winston_logger.error(message, attributes);
        this.logToOtel('error', message, attributes);
    }

    public warn(message: string, attributes: LogAttributes = {}) {
        this.winston_logger.warn(message, attributes);
        this.logToOtel('warn', message, attributes);
    }

    public debug(message: string, attributes: LogAttributes = {}) {
        this.winston_logger.debug(message, attributes);
        this.logToOtel('debug', message, attributes);
    }

    public logRequest(req: Request) {
        const logData = {
            method: req.method,
            url: req.originalUrl,
            path: req.path,
            ip: req.ip || req.connection.remoteAddress,
            userAgent: req.get('user-agent'),
            contentType: req.get('content-type'),
        };

        this.info(`HTTP Request: ${req.method} ${req.url}`, logData);
    }

    public logResponse(req: Request, res: Response, duration: number) {
        const logData = {
            method: req.method,
            url: req.originalUrl,
            statusCode: res.statusCode,
            duration: `${duration}ms`,
            ip: req.ip || req.connection.remoteAddress,
        };

        const level = res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'info';
        this[level](`HTTP Response: ${req.method} ${req.url} ${res.statusCode}`, logData);
    }
}

export const logger = new Logger();
