import { parse, z } from 'zod';

const envSchema = z.object({
   KUBERNETES_ENV: z.enum(['development', 'production']),
   KUBERNETES_PORT: z.number(),
   KUBERNETES_NAMESPACE: z.string().default('default'),
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
