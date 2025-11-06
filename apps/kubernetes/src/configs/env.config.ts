import z from 'zod';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
    path: path.resolve(__dirname, '../../../.env'),
});

const envSchema = z.object({
    KUBERNETES_NODE_ENV: z.enum(['development', 'production']),
    KUBERNETES_PORT: z.string().transform((val) => parseInt(val, 10)),
    KUBERNETES_NAMESPACE: z.string().default('default'),
    KUBERNETES_REDIS_URL: z.url(),
    SERVER_CLOUDFRONT_DOMAIN: z.url(),

});

function parseEnv() {
    try {
        return envSchema.parse(process.env);
    } catch (error) {
        process.exit(1);
    }
}

export const env = parseEnv();