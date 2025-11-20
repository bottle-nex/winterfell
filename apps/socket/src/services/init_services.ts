import RedisPubSub from '../queue/redis.pubsub';
import SocketToOrchestratorQueue from '../queue/redis.queue';
import WebSocketServer from '../ws/socket.server';

export let wsserver: WebSocketServer;
export let redis_pubsub: RedisPubSub;
export let socket_orchestrator_queue: SocketToOrchestratorQueue;

export default function init_services() {
    try {
        redis_pubsub = new RedisPubSub();
        wsserver = new WebSocketServer(redis_pubsub);
        socket_orchestrator_queue = new SocketToOrchestratorQueue('socket-to-orchestrator');
    } catch (error) {
        console.error('Error initializing services:', error);
        throw error;
    }
}
