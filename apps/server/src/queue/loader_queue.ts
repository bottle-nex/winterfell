import { createClient, RedisClientType } from 'redis';

export class ServerToOrchestratorQueue {
    private client: RedisClientType;
    private queue_name: string;

    constructor(queue_name: string) {
        this.queue_name = queue_name;
        this.client = createClient({
            url: 'redis://localhost:6379',
        });
        this.client.connect();
    }

    async push(data: any) {
        const payload = JSON.stringify(data);
        await this.client.lPush(this.queue_name, payload);
    }

    disconnect() {
        this.client.quit();
    }
}
