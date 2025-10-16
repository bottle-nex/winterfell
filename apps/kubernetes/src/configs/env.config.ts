import { parse, z } from "zod";

const envSchema = z.object({
  ORCHESTRATOR_ENV: z.enum(["development", "production"]),
  ORCHESTRATOR_PORT: z.number(),
  ORCHESTRATOR_K8_NAMESPACE: z.string().default("default"),
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
