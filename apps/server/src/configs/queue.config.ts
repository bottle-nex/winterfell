import { QueueOptions } from 'bullmq';
import env from './env';

const queue_config: QueueOptions = {
    connection: {
        url: env.SERVER_REDIS_URL,
    },
    defaultJobOptions: {
        removeOnComplete: {
            count: 100,
            age: 3600,
        },
        removeOnFail: {
            count: 500,
        },
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 2000,
        },
    },
};

export default queue_config;
