import WebSocket, { WebSocketServer as WSServer } from 'ws';
import { CustomWebSocket } from '../types/socket_types';
import { env } from '../configs/env.config';
import { WebSocketPayloadType } from '@repo/types'
import RedisManager from '../queue/redis.pubsub';
import { redis_manager } from '../services/init_services';

export interface ParsedMessage {
    type: 'TERMINAL_STREAM';
    payload: WebSocketPayloadType;
}

export default class WebSocketServer {
    private wss: WSServer | null = null;
    private connection_mapping: Map<string, CustomWebSocket> = new Map();
    private redis: RedisManager = redis_manager;

    constructor() {
        this.wss = new WSServer({ port: env.SOCKET_PORT });
        this.initialize_connection();
    }

    private initialize_connection() {
        if (!this.wss) return;
        this.wss.on('connection', (ws: CustomWebSocket, req) => {
            this.add_listeners(ws);
            const topic = '';
            this.redis.subscribe(topic);
        })
    }

    private add_listeners(ws: CustomWebSocket) {
        ws.on('message', (message) => {
            const parsed = JSON.parse(JSON.stringify(message));
            this.handle_incoming_message(parsed.data);
        })

        ws.on('close', () => {
            this.connection_mapping.delete(ws.user.id);
        })

        ws.on('error', () => {
            this.connection_mapping.delete(ws.user.id);
            ws.close();
        })
    }

    private handle_incoming_message(message: ParsedMessage) {
        switch (message.type) {
            case 'TERMINAL_STREAM'

        }
    }
}
