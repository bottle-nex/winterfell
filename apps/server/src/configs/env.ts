import dotenv from 'dotenv';
import z from 'zod';
import path from 'path';

dotenv.config({
    path: path.resolve(__dirname, '../../../.env'),
});

const envScehma = z.object({
    SERVER_NODE_ENV: z.enum(['development', 'production']),
    DATABASE_URL: z.url(),
    SERVER_PORT: z
        .string()
        .default('8787')
        .transform((val) => parseInt(val, 10)),
    SERVER_JWT_SECRET: z.string().transform((val) => val.trim()),
    SERVER_ANTHROPIC_API_KEY: z.string().transform((val) => val.trim()),
    SERVER_GEMINI_API_KEY: z.string().transform((val) => val.trim()),
    SERVER_AWS_ACCESS_KEY_ID: z.string().transform((val) => val.trim()),
    SERVER_AWS_SECRET_ACCESS_KEY: z.string().transform((val) => val.trim()),
    SERVER_AWS_REGION: z.string().transform((val) => val.trim()),
    SERVER_AWS_BUCKET_NAME: z.string().transform((val) => val.trim()),
    SERVER_CLOUDFRONT_DOMAIN: z.string().transform((val) => val.trim()),
    SERVER_RAZORPAY_KEY_ID: z.string().transform((val) => val.trim()),
    SERVER_RAZORPAY_KEY_SECRET: z.string().transform((val) => val.trim()),
    SERVER_REDIS_URL: z.url().transform((val) => val.trim()),
});

function parseScehma() {
    try {
        return envScehma.parse(process.env);
    } catch (err) {
        console.error('errror while parsing env : ', err);
        process.exit(1);
    }
}

const env = parseScehma();

export default env;
