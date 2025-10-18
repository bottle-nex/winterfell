import { createClient, RedisClientType } from "redis";
import Bull from 'bull';
import { WORKER_QUEUE_TYPES } from "../types/worker_queue_types";
import { pod_service } from "../services/init_services";


export default class ServerToOrchestratorQueue {
    private client: Bull.Queue;
    private queue_name: string;
    private listening: boolean = false;

    constructor(queue_name: string) {
        this.queue_name = queue_name;
        this.client = new Bull(queue_name, {redis: 'redis://localhost:6379'});
        this.setup_queue_processors();
    }

    private setup_queue_processors() {
        this.client.process(WORKER_QUEUE_TYPES.ANCHOR_BUILD_COMMAND)
    }

    private async anchor_build_command_processor(job: Bull.Job) {
        const { codebase, userId, sessionId, projectName } = job.data;
        // data -> code, userId, sessionId, projectName
        const pod_name = await pod_service.create_pod({
            userId,
            sessionId,
            projectName
        });
         
        

    }

    async listen(callback: (data: any) => Promise<void> | void) {
        this.listening = true;

        while (this.listening) {
            try {
                const result = await this.client.process(this.queue_name, 0);
                if (result) {
                    const value = (result as any).element || (Array.isArray(result) ? result[1] : null);
                    if (!value) return;
                    const parsed = JSON.parse(value);
                    console.log(`Pulled data: `, parsed);
                    await callback(parsed);
                }
            } catch (err) {
                console.error('Error while listening data: ', err);
                await new Promise(res => setTimeout(res, 1000));
            }
        }
    }

    async 

    stop() {
        this.listening = false;
    }

    public async disconnect() {
        this.listening = false;
        await this.client.quit();
    }

}