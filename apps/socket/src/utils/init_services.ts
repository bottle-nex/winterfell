import RedisSubscriber from "../services/redis.subscriber";
import WebSocketServer from "../ws/WebsocketServer";

export let redis: RedisSubscriber;
export let wsserver: WebSocketServer;

export default function init_services() {
  redis = new RedisSubscriber();
  wsserver = new WebSocketServer();
}
