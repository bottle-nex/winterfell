import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

const envSchema = z.object({
    SOCKET_JWT_SECRET: z.string(),
});

function parseEnv() {
    try {
        return envSchema.parse(process.env);
    } catch (err) {
        throw new Error(`Invalid environment variables: ${err}`);
    }
}

export const env = parseEnv();
