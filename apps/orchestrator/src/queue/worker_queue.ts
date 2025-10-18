import { createClient, RedisClientType } from "redis";


export default class ServerToOrchestratorQueue {
    private client: RedisClientType;
    private queue_name: string;
    private listening: boolean = false;

    constructor(queue_name: string) {
        this.queue_name = queue_name;
        this.client = createClient({
            url: 'redis://localhost:6379',
        });
        this.client.connect();
    }

    async listen(callback: (data: any) => Promise<void> | void) {
        this.listening = true;

        while (this.listening) {
            try {
                const result = await this.client.brPop(this.queue_name, 0);
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

    stop() {
        this.listening = false;
    }

    public async disconnect() {
        this.listening = false;
        await this.client.quit();
    }

}