import WebSocket, { WebSocketServer as WSServer } from 'ws';
import { CustomWebSocket } from '../types/socket_types';
import { COMMAND, TerminalSocketData, WSServerIncomingPayload } from '@repo/types';
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
            const { authorised, decoded, contractId } = this.authorize_user(ws, req_url);
            console.log('is authorised is : ', contractId);
            if (!authorised || !contractId || !decoded) {
                ws.close();
                return;
            }
            this.add_listeners(ws);
            this.send_confirmation_connection(ws);
            this.connection_mapping.set(contractId, ws);
            // const topic = `${decoded?.id}_${contractId}`;
            // this.redis.subscribe(topic);
        });
    }

    private add_listeners(ws: CustomWebSocket) {
        ws.on('message', (message) => {
            const parsed = JSON.parse(message.toString());
            this.handle_incoming_message(ws, parsed);
        });

        ws.on('close', (code, reason) => {
            console.log('Socket closing - Code:', code, 'Reason:', reason.toString());
            this.connection_mapping.delete(ws.contractId);
        });

        ws.on('error', (err) => {
            console.log('error is socket : ', err);
            this.connection_mapping.delete(ws.contractId); // Changed from ws.user.id
            ws.close();
        });
    }

    private async handle_incoming_message(ws: CustomWebSocket, message: ParsedMessage) {
        console.log('message is : ', message);
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

    private authorize_user(
        ws: CustomWebSocket,
        req: IncomingMessage,
    ): {
        authorised: boolean;
        decoded: AuthUser | null;
        contractId: string | null;
    } {
        const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
        const token = url.searchParams.get('token');
        const contract_id = url.searchParams.get('contractId');

        if (!token || !contract_id) {
            console.error('No token provided');
            return { authorised: false, decoded: null, contractId: null };
        }

        const decoded = jwt.verify(token, env.SOCKET_JWT_SECRET);
        if (!decoded) {
            return { authorised: false, decoded: null, contractId: null };
        }

        ws.user = decoded as AuthUser;
        ws.contractId = contract_id;
        return { authorised: true, decoded: ws.user, contractId: contract_id };
    }

    private send_confirmation_connection(ws: CustomWebSocket) {
        const data: WSServerIncomingPayload<string> = {
            type: TerminalSocketData.CONNECTED,
            payload: 'you are connected to winter shell',
        };
        this.send_message(ws, data);
    }
}
