import RedisSubscriber from './redis.subscriber';
import WebSocketServer from '../ws/WebsocketServer';

export let subscriber: RedisSubscriber;
export let wsserver: WebSocketServer;

export default function init_services() {
    subscriber = new RedisSubscriber();
    wsserver = new WebSocketServer();
}
