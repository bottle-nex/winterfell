export interface MessagePayload {
    type: 'TERMINAL_STREAM';
    payload: unknown;
}

export type MessageHandler = (payload: MessagePayload) => void;
export type ParsedMessage = {
    type: string;
    payload: MessagePayload;
};

export default class WebSocketClient {
    private ws!: WebSocket;
    public is_connected: boolean = false;
    private url: string;
    private token: string;
    private reconnect_attempts = 0;
    private max_reconnect_attempts = 5;
    private reconnect_timeout: NodeJS.Timeout | null = null;
    private reconnect_delay: number = 1000;
    private max_reconnect_delay: number = 30000;
    private persistent_reconnect_delay: number = 5000;
    private message_queue: MessagePayload[] = [];
    private handlers: Map<string, MessageHandler[]> = new Map();
    private is_manually_closed: boolean = false;

    constructor(url: string, token: string) {
        this.url = url;
        this.token = token;
        this.is_manually_closed = false;
        this.initialize_connection();
    }

    private initialize_connection() {
        if (this.is_manually_closed) {
            return;
        }

        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
            this.is_connected = true;
            this.reconnect_attempts = 0;
            this.reconnect_delay = 1000;
        };

        this.ws.onmessage = (event: MessageEvent<string>) => {
            try {
                const parsed_data: ParsedMessage = JSON.parse(event.data);
                this.handle_incoming_message(parsed_data);
            } catch (error) {
                console.error('Failed to parse incoming WebSocket message:', event.data, error);
            }
        };

        this.ws.onclose = (event: CloseEvent) => {
            this.is_connected = false;

            if (this.reconnect_timeout) {
                clearTimeout(this.reconnect_timeout);
                this.reconnect_timeout = null;
            }

            if (!this.is_manually_closed && event.code !== 1000) {
                this.attempt_reconnect();
            }
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    }

    private handle_incoming_message(parsed_data: ParsedMessage) {
        const { type, payload } = parsed_data;
        const handlers = this.handlers.get(type);
        if (handlers) {
            handlers.forEach((handler) => handler(payload));
        }
    }

    public subscribe_to_handlers(type: string, handler: MessageHandler) {
        if (!this.handlers.has(type)) {
            this.handlers.set(type, []);
        }
        this.handlers.get(type)!.push(handler);
    }

    public unsubscribe_to_handlers(type: string, handler: MessageHandler) {
        const handler_list = this.handlers.get(type);
        if (!handler_list) return;

        const index = handler_list.indexOf(handler);
        if (index !== -1) {
            handler_list.splice(index, 1);
        }

        if (handler_list.length === 0) {
            this.handlers.delete(type);
        }
    }

    public send_message(message: MessagePayload) {
        if (this.is_connected && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(message));
            this.flush_message_queue();
        } else {
            this.message_queue.push(message);
        }
    }

    private attempt_reconnect() {
        if (this.is_manually_closed) return;

        this.reconnect_attempts++;

        let delay: number;

        if (this.reconnect_attempts <= this.max_reconnect_attempts) {
            delay = this.reconnect_delay;
            this.reconnect_delay = Math.min(this.reconnect_delay * 2, this.max_reconnect_delay);
        } else {
            console.warn(
                `Max reconnection attempts (${this.max_reconnect_attempts}) reached. Switching to persistent reconnection mode.`,
            );
            delay = this.persistent_reconnect_delay;
            this.reconnect_delay = 1000;
        }

        this.reconnect_timeout = setTimeout(() => {
            if (!this.is_manually_closed) {
                this.initialize_connection();
            }
        }, delay);
    }

    private flush_message_queue() {
        while (this.message_queue.length > 0) {
            const message = this.message_queue.shift();
            if (message) {
                this.send_message(message);
            }
        }
    }

    public close(code: number = 1000, reason: string = 'Client disconnect') {
        this.is_manually_closed = true;

        if (this.reconnect_timeout) {
            clearTimeout(this.reconnect_timeout);
            this.reconnect_timeout = null;
        }

        if (
            this.ws &&
            (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)
        ) {
            this.ws.close(code, reason);
        }

        this.is_connected = false;
        this.handlers.clear();
        this.message_queue = [];
    }
}
