import RedisPubSub from '../queue/redis.pubsub';
import SocketToOrchestratorQueue from '../queue/redis.queue';
import WebSocketServer from '../ws/socket.server';

export let wsserver: WebSocketServer;
export let redis_pubsub: RedisPubSub;
export let socket_orchestrator_queue: SocketToOrchestratorQueue;

export default function init_services() {
    redis_pubsub = new RedisPubSub();
    wsserver = new WebSocketServer();
    socket_orchestrator_queue = new SocketToOrchestratorQueue('socket-to-orchestrator');
}
