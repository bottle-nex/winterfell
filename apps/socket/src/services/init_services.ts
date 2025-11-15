import RedisPubSub from '../redis/redis.pubsub';
import SocketToOrchestratorQueue from '../redis/redis.queue';
import WebSocketServer from '../ws/WebsocketServer';

export let wsserver: WebSocketServer;
export let redis_pubsub: RedisPubSub;
export let socket_orchestrator_queue: SocketToOrchestratorQueue;

export default function init_services() {
    wsserver = new WebSocketServer();
    redis_pubsub = new RedisPubSub();
    socket_orchestrator_queue = new SocketToOrchestratorQueue('socket-to-orchestrator');
}
