import { BuildJobPayload, COMMAND } from "@repo/types";
import { Job, Worker } from "bullmq";

export default class RedisQueue {
    private queue: Worker;

    constructor(queue_name: string) {
        this.queue = new Worker(queue_name, this.process_job);
    }

    private async process_job(job: Job) {
        const command = job.name as COMMAND;
        const payload = job.data as BuildJobPayload;

        console.log(`Processing job ${job.id}: ${command}`);

        try {
            switch (command) {
                case COMMAND.WINTERFELL_BUILD:
                    return await this.handleBuild(payload);

                case COMMAND.WINTERFELL_TEST:
                    return await this.handleTest(payload);

                case COMMAND.WINTERFELL_DEPLOY_DEVNET:
                    return await this.handleDeployDevnet(payload);

                case COMMAND.WINTERFELL_DEPLOY_MAINNET:
                    return await this.handleDeployMainnet(payload);

                case COMMAND.WINTERFELL_VERIFY:
                    return await this.handleVerify(payload);

                default:
                    throw new Error(`Unknown command: ${command}`);
            }
        } catch (error) {
            console.error(`Error processing job ${job.id}:`, error);
            throw error;
        }
    }

    private async handleBuild(payload: BuildJobPayload) {
        console.log('Building contract:', payload.contractId);
        return { success: true, message: 'Build completed' };
    }

    private async handleTest(payload: BuildJobPayload) {
        console.log('Testing contract:', payload.contractId);
        return { success: true, message: 'Tests passed' };
    }

    private async handleDeployDevnet(payload: BuildJobPayload) {
        console.log('Deploying to devnet:', payload.contractId);
        return { success: true, message: 'Deployed to devnet' };
    }

    private async handleDeployMainnet(payload: BuildJobPayload) {
        console.log('Deploying to mainnet:', payload.contractId);
        return { success: true, message: 'Deployed to mainnet' };
    }

    private async handleVerify(payload: BuildJobPayload) {
        console.log('Verifying contract:', payload.contractId);
        return { success: true, message: 'Verification completed' };
    }

    public async close() {
        await this.queue.close();
    }
}