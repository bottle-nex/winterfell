import { Queue } from 'bullmq';
import queue_config from '../configs/queue.config';
import { BuildJobPayload, COMMAND } from '@repo/types';

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
                jobId: `anchor-command-${payload.contractId}-${Date.now()}`,
            });
            return job.id;
        } catch (err) {
            console.error('failed to run anchor build command', err);
            return undefined;
        }
    }
}
