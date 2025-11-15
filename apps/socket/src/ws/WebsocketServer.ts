import WebSocket, { WebSocketServer as WSServer } from 'ws';
import { CustomWebSocket } from '../types/socket_types';
import { env } from '../configs/config.env';
import { COMMAND, WSServerIncomingPayload } from '@repo/types';
import CommandService from '../build/build';
import { redis_pubsub } from '../services/init_services';
import RedisPubSub from '../redis/redis.pubsub';

export interface ParsedMessage {
    type: COMMAND;
    payload: string;
}

export default class WebSocketServer {
    private wss: WSServer | null = null;
    private connection_mapping: Map<string, CustomWebSocket> = new Map();
    private redis: RedisPubSub = redis_pubsub;

    constructor() {
        this.wss = new WSServer({ port: env.SOCKET_PORT });
        this.initialize_connection();
    }

    private initialize_connection() {
        if (!this.wss) return;
        this.wss.on('connection', (ws: CustomWebSocket) => {
            this.add_listeners(ws);
            const topic = '';
            this.redis.subscribe(topic);
        });
    }

    private add_listeners(ws: CustomWebSocket) {
        ws.on('message', (message) => {
            const parsed = JSON.parse(JSON.stringify(message));
            this.handle_incoming_message(ws, parsed);
        });

        ws.on('close', () => {
            this.connection_mapping.delete(ws.user.id);
        });

        ws.on('error', () => {
            this.connection_mapping.delete(ws.user.id);
            ws.close();
        });
    }

    private async handle_incoming_message(ws: CustomWebSocket, message: ParsedMessage) {
        switch (message.type as COMMAND) {
            case COMMAND.WINTERFELL_BUILD:
                return await CommandService.handle_incoming_build(ws, message);
            default:
                return;
        }
    }

    public send_message<T>(ws: CustomWebSocket, message: WSServerIncomingPayload<T>) {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(message));
        }
    }
}
