import { Queue } from 'bullmq';
import { BuildJobPayload, COMMAND } from '@repo/types';
import crypto from 'crypto';
import Redis from 'ioredis';


export default class RedisManager {
    private redis: Redis;
    private is_connected: boolean = false;

    constructor() {
        this.redis = new Redis("");
        this.is_connected = true;
    }

    /**
     * this method is used to subscribe to a topic in the redis channel
     * @param topic 
     * @returns void and subscribe to the redis channel
     */
    public subscribe(topic: string) {
        if (!this.is_connected) return;
        this.redis.subscribe(topic);
    }
}