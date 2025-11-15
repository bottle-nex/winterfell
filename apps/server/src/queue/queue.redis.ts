import { Queue } from 'bullmq';
import queue_config from '../configs/config.queue';
import { BuildJobPayload, COMMAND } from '@repo/types';
import crypto from 'crypto';

export default class ServerToOrchestratorQueue {
    private queue: Queue;
    constructor(queue_name: string) {
        this.queue = new Queue(queue_name, queue_config);
    }

    /**
     * queues the users command to the server kubernetes queue
     * @param command
     * @param payload
     * @returns job id of the job which is been queued
     */
    public async queue_command(
        command: COMMAND,
        payload: BuildJobPayload,
    ): Promise<string | undefined> {
        try {
            const job = await this.queue.add(command, payload, {
                priority: 2,
                jobId: `anchor-command-${payload.contractId}-${this.create_job_id()}`,
            });
            return job.id;
        } catch (err) {
            console.error('failed to run anchor build command', err);
            return undefined;
        }
    }

    private create_job_id() {
        return crypto.randomBytes(10).toString('hex');
    }
}
