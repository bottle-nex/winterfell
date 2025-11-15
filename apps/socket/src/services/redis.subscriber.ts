import { Redis } from 'ioredis';
import { wsserver } from './init_services';
import { ParsedMessage } from '../ws/WebsocketServer';
import { env } from '../configs/env.config';

export default class RedisSubscriber {
    private subscriber: Redis;

    constructor() {
        this.subscriber = new Redis(env.SOCKET_REDIS_URL);
        this.setup_subscription();
    }

    public async subscribe(channel: string) {
        if (!channel) {
            throw new Error('Channel is required');
        }
        console.log('channel is : ', channel);
        await this.subscriber.subscribe(channel);
    }

    public setup_subscription() {
        this.subscriber.on('message', (channel: string, message: string) => {
            const message_json: ParsedMessage = JSON.parse(message);
            console.log('Received message on channel', channel, message_json);
            wsserver.send_to_connection(channel, message_json);
        });
    }
}
