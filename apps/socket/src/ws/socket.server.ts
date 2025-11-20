import WebSocket, { WebSocketServer as WSServer } from 'ws';
import { CustomWebSocket } from '../types/socket_types';
import { COMMAND, WSServerIncomingPayload } from '@repo/types';
import RedisPubSub from '../queue/redis.pubsub';
import { env } from '../configs/config.env';
import CommandService from '../services/services.command';
import { IncomingMessage } from 'http';
import jwt from 'jsonwebtoken';
import { AuthUser } from '../types/auth_user';

export interface ParsedMessage {
    type: COMMAND;
    payload: string;
}

export default class WebSocketServer {
    private wss: WSServer | null = null;
    private connection_mapping: Map<string, CustomWebSocket> = new Map();
    private redis: RedisPubSub;

    constructor(redis: RedisPubSub) {
        this.redis = redis;
        this.wss = new WSServer({ port: env.SOCKET_PORT });
        this.initialize_connection();
        console.log('wss server is up and running at port : ', env.SOCKET_PORT);
    }

    private initialize_connection() {
        if (!this.wss) return;
        this.wss.on('connection', (ws: CustomWebSocket, req_url: IncomingMessage) => {
            console.log('socket connected');
            const is_authorized = this.authorize_user(ws, req_url);
            console.log('is authorised is : ', is_authorized);
            if (!is_authorized) {
                ws.close();
                return;
            }

            this.add_listeners(ws);

            // const topic = '';
            // this.redis.subscribe(topic);
        });
    }

    private add_listeners(ws: CustomWebSocket) {
        ws.on('message', (message) => {
            const parsed = JSON.parse(JSON.stringify(message));
            this.handle_incoming_message(ws, parsed);
        });

        // ws.on('close', () => {
        //     this.connection_mapping.delete(ws.user.id);
        // });

        // ws.on('error', () => {
        //     this.connection_mapping.delete(ws.user.id);
        //     ws.close();
        // });
    }

    private async handle_incoming_message(ws: CustomWebSocket, message: ParsedMessage) {
        switch (message.type as COMMAND) {
            case COMMAND.WINTERFELL_BUILD: {
                const data = await CommandService.handle_incoming_build(ws, message);
                this.send_message(ws, data);
                return;
            }

            default:
                return;
        }
    }

    public send_message<T>(ws: CustomWebSocket, message: WSServerIncomingPayload<T>) {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(message));
        }
    }

    private authorize_user(ws: CustomWebSocket, req: IncomingMessage) {
        const url = new URL(req.url || `http://${req.headers.host}`);
        const token = url.searchParams.get('token');

        if (!token) {
            console.error('No token provided');
            return false;
        }

        const decoded = jwt.verify(token, env.SOCKET_JWT_SECRET);
        console.log('decoded is : ', decoded);
        if (!decoded) return false;

        ws.user = decoded as AuthUser;
    }
}
