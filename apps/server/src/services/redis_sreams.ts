import Redis from 'ioredis';
import env from '../configs/env';
import { BaseJobPayload, COMMAND, STREAM_NAMES } from '@repo/types';
import { BuildStatus, prisma } from '@repo/database';

export default class RedisStream {
    private redis: Redis;
    private is_connected: boolean = false;

    constructor() {
        this.redis = new Redis(env.SERVER_REDIS_URL);
        this.is_connected = true;
    }

    /**
     * Adds a new entry to the redis stream
     * @param {COMMAND} command - The name of the Redis stream to add data to.
     * @param {T} payload - The payload data to store in the stream.
     * @returns {Promise<string | null> } - The message ID if successful, or `null` if there was an error.
     */

    public async add_to_redis_stream<T extends BaseJobPayload>(
        command: COMMAND,
        payload: T,
    ): Promise<{ jobId: string; buildJobId: string } | null> {
        if (!this.is_connected) return null;
        try {
            const job = await prisma.buildJob.create({
                data: {
                    contractId: payload.contractId,
                    command,
                    jobId: '',
                    status: BuildStatus.PENDING,
                },
            });

            const stream_name = STREAM_NAMES[COMMAND.WINTERFELL_BUILD];

            const jobId: string | null = await this.redis.xadd(
                stream_name,
                '*',
                JSON.stringify(payload),
            );

            await prisma.buildJob.update({
                where: { id: job.id },
                data: {
                    jobId: jobId as string,
                    status: BuildStatus.QUEUED,
                },
            });
            return {
                jobId: jobId as string,
                buildJobId: job.id,
            };
        } catch (err) {
            console.error('Error in adding the data to the stream', err);
            return null;
        }
    }
}
