import { env } from "./configs.env";
import Redis from 'ioredis';

const redis_config = new Redis({
    host: env.KUBERNETES_REDIS_URL,
    port: env.KUBERNETES_PORT,
});

export default redis_config;