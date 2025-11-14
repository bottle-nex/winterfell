import RedisManager from '../queue/redis.pubsub';
import WebSocketServer from '../ws/WebsocketServer';

export let wsserver: WebSocketServer;
export let redis_manager: RedisManager;

export default function init_services() {
    wsserver = new WebSocketServer();
    redis_manager = new RedisManager();
}
