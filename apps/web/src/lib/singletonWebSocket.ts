import WebSocketClient from "../class/socket.client";

let client: WebSocketClient | null = null;

export function getWebSocketClient(token: string, contractId: string) {
    if (!token || !contractId) {
        throw new Error('Token and contractId are required');
    }

    const base = `ws://localhost:8081`;
    const url = `${base}?contractId=${encodeURIComponent(contractId)}&token=${encodeURIComponent(token)}`;

    if (client) {
        client.close();
    }

    client = new WebSocketClient(url, token);
    return client;
}

export function cleanWebSocketClient() {
    if (client) {
        client.close();
        client = null;
    }
}
