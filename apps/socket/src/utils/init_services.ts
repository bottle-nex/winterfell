import RedisSubscriber from '../services/redis.subscriber';
import WebSocketServer from '../ws/socket.server';

export let redis: RedisSubscriber;
export let wsserver: WebSocketServer;

export default function init_services() {
    redis = new RedisSubscriber();
    wsserver = new WebSocketServer();
}
