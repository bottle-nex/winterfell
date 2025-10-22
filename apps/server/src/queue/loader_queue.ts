import Bull, { JobOptions } from 'bull';
import env from '../configs/env';
import { AnchorBuildQueueData, WORKER_QUEUE_TYPES } from '../types/worker_queue_types';
import { logger } from '../utils/logger';

export default class ServerToOrchestratorQueue {
    private static instance: ServerToOrchestratorQueue;
    private queue: Bull.Queue;
    constructor() {
        this.queue = new Bull('server-to-orchestrator', {
            redis: env.SERVER_REDIS_URL,
            defaultJobOptions: {
                removeOnComplete: 100,
                removeOnFail: false,
                attempts: 3,
                timeout: 300000,
                backoff: {
                    type: 'exponential',
                    delay: 2000,
                },
            },
        });
        this.setup_listeners();
    }

    public async run_anchor_build_command(
        userId: string,
        sessionId: string,
        projectName: string,
        options?: Partial<JobOptions>,
    ): Promise<void> {
        try {
            const data: AnchorBuildQueueData = {
                userId,
                sessionId,
                projectName,
            };
            const job_id: string = this.get_job_id(userId, sessionId, projectName);
            const job_options: JobOptions = {
                ...options,
                jobId: job_id,
                priority: 2,
            };
            await this.queue.add(WORKER_QUEUE_TYPES.ANCHOR_BUILD_COMMAND, data, job_options);
        } catch (err) {
            logger.error('failed to run anchor build command', err);
        }
    }

    public async run_anchor_deploy_command(
        userId: string,
        sessionId: string,
        projectName: string,
        options?: Partial<JobOptions>,
    ): Promise<void> {
        try {
            const data: AnchorBuildQueueData = {
                userId,
                sessionId,
                projectName,
            };
            const job_id: string = this.get_job_id(userId, sessionId, projectName);
            const job_options: JobOptions = {
                ...options,
                jobId: job_id,
                priority: 2,
            };
            await this.queue.add(WORKER_QUEUE_TYPES.ANCHOR_DEPLOY_COMMAND, data, job_options);
        } catch (err) {
            logger.error('failed to run anchor deploy command', err);
        }
    }

    public async run_anchor_test_command(
        userId: string,
        sessionId: string,
        projectName: string,
        options?: Partial<JobOptions>,
    ): Promise<void> {
        try {
            const data: AnchorBuildQueueData = {
                userId,
                sessionId,
                projectName,
            };
            const job_id: string = this.get_job_id(userId, sessionId, projectName);
            const job_options: JobOptions = {
                ...options,
                jobId: job_id,
                priority: 2,
            };
            await this.queue.add(WORKER_QUEUE_TYPES.ANCHOR_TEST_COMMAND, data, job_options);
        } catch (err) {
            logger.error('failed to run anchor test command', err);
        }
    }

    public static get_instance() {
        if (!ServerToOrchestratorQueue.instance) {
            ServerToOrchestratorQueue.instance = new ServerToOrchestratorQueue();
        }
        return ServerToOrchestratorQueue.instance;
    }

    private get_job_id(userId: string, sessionId: string, projectName: string) {
        return `${userId}-${sessionId}-${projectName}`;
    }

    private setup_listeners() {
        this.queue.on('completed', (job) => {
            logger.info('job completed', job.data);
        });
        this.queue.on('failed', (job) => {
            logger.error('job failed', job.data);
        });
        this.queue.on('stalled', (job) => {
            logger.error('job stalled', job.data);
        });
        this.queue.on('active', (job) => {
            logger.info('job active', job.data);
        });
        logger.info('server-orchestrator queue started');
    }
}
