import { useEffect, useRef, useState } from 'react';
import WebSocketClient, { ParsedOutgoingMessage } from '../class/socket.client';
import { cleanWebSocketClient, getWebSocketClient } from '../lib/singletonWebSocket';
import { useUserSessionStore } from '../store/user/useUserSessionStore';
import { useParams } from 'next/navigation';
import { COMMAND } from '@repo/types';
import { COMMAND_WRITER } from '../lib/terminal_commands';

export const useWebSocket = () => {
    const socket = useRef<WebSocketClient | null>(null);
    const params = useParams();
    const { session } = useUserSessionStore();
    const contractId = params?.contractId as string | undefined;
    const [isConnected, setIsConnected] = useState<boolean>(false);

    useEffect(() => {
        const token = session?.user?.token;
        if (!token || !contractId) {
            return;
        }

        let interval: NodeJS.Timeout | null = null;

        try {
            socket.current = getWebSocketClient(token, contractId);

            interval = setInterval(() => {
                if (socket.current) {
                    setIsConnected(socket.current.is_connected);
                }
            }, 100);

        } catch (error) {
            setIsConnected(false);
            console.error('Failed to initialize WebSocket:', error);
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
            setIsConnected(false);
            socket.current = null;
            cleanWebSocketClient();
        };
    }, [session?.user?.token, contractId]);

    function subscribeToHandler(handler: (payload: string) => void) {
        if (!socket.current) return;
        socket.current.subscribe_to_handlers('TERMINAL_STREAM', handler);
    }

    // todo: @rishi this should also get the contract name
    function sendSocketMessage(command: COMMAND, message: COMMAND_WRITER) {
        if (!socket.current) return;
        const data: ParsedOutgoingMessage<{ message: string, contractName: string }> = {
            type: command,
            payload: {
                contractName: '',
                message: "executing " + message
            },
        };
        socket.current.send_message(data);
    }

    return {
        isConnected,
        subscribeToHandler,
        sendSocketMessage,
    };
};