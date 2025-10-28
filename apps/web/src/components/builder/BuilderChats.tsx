'use client';
import BuilderChatInput from './BuilderChatInput';
import { useBuilderChatStore } from '@/src/store/code/useBuilderChatStore';
import Image from 'next/image';
import { useUserSessionStore } from '@/src/store/user/useUserSessionStore';
import { useParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { CHAT_URL } from '@/routes/api_routes';
import { StreamEvent } from '@/src/types/stream_event_types';
import AnimtaedLoader from '../ui/animated-loader';

import StreamEventProcessor from '@/src/class/handle_stream_event';
import SystemMessage from './SystemMessage';
import AppLogo from '../tickers/AppLogo';
import { useCodeEditor } from '@/src/store/code/useCodeEditor';
import { useChatStore } from '@/src/store/user/useChatStore';

export default function BuilderChats() {
    const { messages, loading, setLoading } = useBuilderChatStore();
    const { session } = useUserSessionStore();
    const params = useParams();
    const contractId = params.contractId as string;
    const hasInitialized = useRef(false);
    const messageEndRef = useRef<HTMLDivElement>(null);
    const { setCollapseFileTree } = useCodeEditor();
    const { setContractId } = useChatStore();

    useEffect(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    useEffect(() => {
        if (hasInitialized.current) return;
        hasInitialized.current = true;

        const initialMessage = messages.find(
            (msg) => msg.contractId === contractId && msg.role === 'USER',
        );
        if (initialMessage) {
            startChat(initialMessage.content);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contractId]);

    async function startChat(message: string) {
        try {
            setLoading(true);
            const response = await fetch(CHAT_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session?.user.token}`,
                },
                body: JSON.stringify({
                    contractId: contractId,
                    message: message,
                }),
            });

            console.log('--------------------------------------->');
            console.log(response.body);

            if (!response.ok) {
                throw new Error('Failed to start chat');
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();

            if (!reader) {
                throw new Error('No response body');
            }

            while (true) {
                const { done, value } = await reader.read();

                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n').filter((line) => line.trim());

                for (const line of lines) {
                    try {
                        const jsonString = line.startsWith('data: ') ? line.slice(6) : line;
                        const event: StreamEvent = JSON.parse(jsonString);

                        StreamEventProcessor.process(event);
                    } catch {
                        console.error('Failed to parse stream event');
                    }
                }
            }
            setCollapseFileTree(true);
        } catch (error) {
            console.error('Chat stream error:', error);
        } finally {
            setLoading(false);
        }
    }

    function returnParsedData(message: string) {
        const result = message.split('<stage>')[0];
        return result;
    }

    return (
        <div className="w-full flex flex-col pt-4" style={{ height: 'calc(100vh - 3.5rem)' }}>
            <div className="flex-1 flex flex-col gap-y-3 text-light text-sm px-6 overflow-y-auto min-h-0 custom-scrollbar">
                {messages.map((message) => (
                    <div key={message.id} className="w-full flex flex-shrink-0">
                        {message.role === 'USER' && (
                            <div className="flex justify-end w-full">
                                <div className="flex items-center gap-x-2 max-w-[70%]">
                                    <div className="px-4 py-2 rounded-[4px] text-sm font-semibold bg-dark text-light text-right">
                                        {message.content}
                                    </div>
                                    {session?.user.image && (
                                        <Image
                                            className="rounded-full flex-shrink-0"
                                            src={session.user.image}
                                            alt="user"
                                            width={36}
                                            height={36}
                                        />
                                    )}
                                </div>
                            </div>
                        )}
                        {message.role === 'AI' && (
                            <div className="flex justify-start w-full">
                                <div className="flex items-start gap-x-2 max-w-[70%]">
                                    <AppLogo showLogoText={false} />
                                    <div className="px-4 py-2 rounded-[4px] text-sm font-normal bg-dark text-light text-left tracking-wider text-[13px] italic">
                                        {returnParsedData(message.content)}
                                    </div>
                                </div>
                            </div>
                        )}
                        {message.role === 'SYSTEM' && (
                            <div className="flex justify-start items-start w-full my-4 ">
                                <div className="flex items-start gap-x-2 w-full">
                                    <div className="rounded-[4px] text-sm font-normal w-full text-light text-left tracking-wider text-[13px]">
                                        {loading && (
                                            <div className="flex items-center gap-x-2 mb-2">
                                                <AnimtaedLoader
                                                    shouldAnimate={loading}
                                                    className="h-4 w-4"
                                                />
                                                <span>Processing your request...</span>
                                            </div>
                                        )}
                                        <SystemMessage
                                            message={message}
                                            data={{
                                                currentStage: undefined as never,
                                                currentPhase: undefined as never,
                                                currentFile: undefined as never,
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
                <div ref={messageEndRef} />
            </div>
            <div className="flex items-center justify-center w-full py-4 px-6 flex-shrink-0">
                <BuilderChatInput />
            </div>
        </div>
    );
}
