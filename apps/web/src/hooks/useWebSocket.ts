import { useEffect, useRef } from 'react';
import WebSocketClient from '../class/socket.client';
import { cleanWebSocketClient, getWebSocketClient } from '../lib/singletonWebSocket';
import { useUserSessionStore } from '../store/user/useUserSessionStore';
import { useParams } from 'next/navigation';

export const useWebSocket = () => {
    const socket = useRef<WebSocketClient | null>(null);
    const params = useParams();
    const { session } = useUserSessionStore();
    const contractId = params?.contractId as string | undefined;

    useEffect(() => {
        const token = session?.user?.token;
        if (!token || !contractId) {
            return;
        }

        try {
            socket.current = getWebSocketClient(token, contractId);
        } catch (error) {
            console.error('Failed to initialize WebSocket:', error);
        }

        return () => {
            cleanWebSocketClient();
            socket.current = null;
        };
    }, [session?.user?.token, contractId]);

    return socket.current;
};
