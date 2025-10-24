import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

const envSchema = z.object({
   KUBERNETES_NODE_ENV: z.enum(['development', 'production']),
   KUBERNETES_PORT: z.string().transform((val) => parseInt(val, 10)),
   KUBERNETES_NAMESPACE: z.string().default('default'),
   SERVER_CLOUDFRONT_DOMAIN: z.url(),
});

function parseEnv() {
   try {
      return envSchema.parse(process.env);
   } catch (err) {
      throw new Error(`Invalid environment variables: ${err}`);
      process.exit(1);
   }
}

export const env = parseEnv();
