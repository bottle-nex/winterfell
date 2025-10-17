'use client';

import { cn } from '@/src/lib/utils';
import BuilderChatInput from './BuilderChatInput';
import { useBuilderChatStore } from '@/src/store/code/useBuilderChatStore';
import Image from 'next/image';
import { useUserSessionStore } from '@/src/store/user/useUserSessionStore';
import { useParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { CHAT_URL } from '@/routes/api_routes';


export default function BuilderChats() {
    const { messages, setMessage } = useBuilderChatStore();
    const { session } = useUserSessionStore();
    const params = useParams();
    const chatId = params.chatId as string;
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const hasInitialized = useRef(false);
    useEffect(() => {
        if (hasInitialized.current) return;
        hasInitialized.current = true;

        const initialMessage = messages.find((msg) => msg.chatId === chatId && msg.role === 'USER');

        if (initialMessage) {
            startChat(initialMessage.content);
        }
    }, [chatId]);

    async function startChat(message: string) {
        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.post(
                CHAT_URL,
                {
                    chatId: chatId,
                    message: message,
                },
                {
                    headers: {
                        Authorization: `Bearer ${session?.user.token}`,
                    },
                },
            );

            await handleStreamingResponse(response.data);
        } catch (err) {
            console.error('Error starting chat:', err);
            setError('Failed to start chat');
        } finally {
            setIsLoading(false);
        }
    }

    async function handleStreamingResponse(stream: ReadableStream) {
        const reader = stream.getReader();
        const decoder = new TextDecoder();

        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                console.log(chunk);
            }
        } catch (err) {
            console.error('Error reading stream:', err);
            setError('Stream reading failed');
        }
    }

    const currentChatMessages = messages.filter((msg) => msg.chatId === chatId);

    return (
        <div className="w-full flex flex-col justify-between h-full pt-4">
            <div className="flex flex-col w-full gap-y-3 text-light text-sm px-6 overflow-y-auto flex-1">
                {currentChatMessages.map((message) => (
                    <div key={message.id}>
                        <div
                            className={cn(
                                'flex w-full items-center gap-x-2',
                                message.role === 'USER' ? 'justify-end' : 'justify-start',
                            )}
                        >
                            <div
                                className={cn(
                                    'max-w-[70%] px-4 py-2 rounded-[4px] text-sm font-normal',
                                    message.role === 'USER' && 'bg-dark text-light font-semibold',
                                )}
                            >
                                {message.content}
                            </div>
                            {message.role === 'USER' && session?.user.image && (
                                <Image
                                    className="rounded-full"
                                    src={session.user.image}
                                    alt="user"
                                    width={36}
                                    height={36}
                                />
                            )}
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex items-center gap-x-2 text-neutral-500">
                        <div className="animate-pulse">AI is thinking...</div>
                    </div>
                )}

                {error && (
                    <div className="text-red-500 text-sm px-4 py-2 bg-red-500/10 rounded">
                        {error}
                    </div>
                )}
            </div>
            <div className="flex items-center justify-center w-full py-4">
                <BuilderChatInput />
            </div>
        </div>
    );
}
