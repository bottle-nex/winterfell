import { Redis } from "ioredis";

export default class RedisSubscriber {
    private redis: Redis;

    constructor() {
        this.redis = new Redis('redis://localhost:6379');
        this.setup_subscription();
    }

    public subscribe(channel: string) {
        if (!channel) {
            throw new Error('Channel is required');
        }
        this.redis.subscribe(channel);
    }

    public setup_subscription() {
        this.redis.on('message', (channel: string, message: string) => {
            const message_json = JSON.parse(message);
            console.log('Received message on channel', channel, message_json);
        })
    }
}