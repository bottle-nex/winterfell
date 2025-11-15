import { z } from 'zod';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
    path: path.resolve(__dirname, '../../../.env'),
});

const envSchema = z.object({
    SOCKET_JWT_SECRET: z.string(),
    SOCKET_REDIS_URL: z.url(),
    SOCKET_PORT: z.string().transform((val) => Number(val)),
    DATABASE_URL: z.url(),
});

function parseEnv() {
    try {
        return envSchema.parse(process.env);
    } catch {
        process.exit(1);
    }
}

export const env = parseEnv();
