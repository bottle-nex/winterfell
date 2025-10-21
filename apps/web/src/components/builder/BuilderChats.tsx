'use client';
import BuilderChatInput from './BuilderChatInput';
import { useBuilderChatStore } from '@/src/store/code/useBuilderChatStore';
import Image from 'next/image';
import { useUserSessionStore } from '@/src/store/user/useUserSessionStore';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { CHAT_URL } from '@/routes/api_routes';
import {
    FILE_STRUCTURE_TYPES,
    FileContent,
    PHASE_TYPES,
    STAGE,
    StreamEvent,
} from '@/src/types/stream_event_types';
import BuilderChatSystemMessage from './BuilderChatSystemMessage';
import { useCodeEditor } from '@/src/store/code/useCodeEditor';
import AnimtaedLoader from '../ui/animated-loader';
import { Message } from '@/src/types/prisma-types';

export default function BuilderChats() {
    const { messages, loading, upsertMessage, setPhase, setLoading, setCurrentFileEditing } =
        useBuilderChatStore();
    const { parseFileStructure } = useCodeEditor();
    const { session } = useUserSessionStore();
    const params = useParams();
    const chatId = params.chatId as string;
    const hasInitialized = useRef(false);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (hasInitialized.current) return;
        hasInitialized.current = true;

        const initialMessage = messages.find((msg) => msg.chatId === chatId && msg.role === 'USER');
        if (initialMessage) {
            startChat(initialMessage.content);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chatId]);

    async function startChat(message: string) {
        if (isProcessing) return;
        setIsProcessing(true);

        try {
            setLoading(true);
            const response = await fetch(CHAT_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session?.user.token}`,
                },
                body: JSON.stringify({
                    chatId: chatId,
                    message: message,
                }),
            });

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

                        handleStreamEvent(event);
                    } catch {
                        console.error('Failed to parse stream event');
                    }
                }
            }
        } catch (error) {
            console.error('Chat stream error:', error);
        } finally {
            setIsProcessing(false);
            setLoading(false);
        }
    }

    function handleStreamEvent(event: StreamEvent) {
        switch (event.type) {
            case PHASE_TYPES.STARTING:
                if (event.systemMessage) {
                    upsertMessage(event.systemMessage);
                }
                break;

            case STAGE.CONTEXT:
                if ('llmMessage' in event.data) {
                    upsertMessage(event.data.llmMessage as Message);
                }
                break;

            case STAGE.PLANNING:
            case STAGE.GENERATING_CODE:
            case STAGE.BUILDING:
            case STAGE.CREATING_FILES:
            case STAGE.FINALIZING:
                if (event.systemMessage) {
                    upsertMessage(event.systemMessage);
                }
                break;

            case PHASE_TYPES.THINKING:
            case PHASE_TYPES.GENERATING:
            case PHASE_TYPES.BUILDING:
            case PHASE_TYPES.CREATING_FILES:
            case PHASE_TYPES.COMPLETE:
                setPhase(event.type);
                break;

            case FILE_STRUCTURE_TYPES.EDITING_FILE:
                setPhase(event.type);
                if ('file' in event.data) {
                    setCurrentFileEditing(event.data.file as string);
                }
                break;

            case PHASE_TYPES.ERROR:
                console.error('LLM Error:', event.data);
                break;

            case STAGE.END:
                if ('data' in event.data) {
                    parseFileStructure(event.data.data as FileContent[]);
                }
                break;

            default:
                break;
        }
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
                                    <Image
                                        className="rounded-full flex-shrink-0"
                                        src={'/icons/claude.png'}
                                        alt="ai"
                                        width={24}
                                        height={24}
                                    />
                                    <div className="px-4 py-2 rounded-[4px] text-sm font-normal bg-dark text-light text-left tracking-wider text-[13px] italic">
                                        {message.content}
                                    </div>
                                </div>
                            </div>
                        )}
                        {message.role === 'SYSTEM' && (
                            <div className="flex justify-start items-start w-full mt-4">
                                <div className="flex items-start gap-x-2 w-full">
                                    <div className="px-4 py-2 rounded-[4px] text-sm font-normal bg-[#0c0d0e] w-full text-light text-left tracking-wider text-[13px]">
                                        <div className="flex items-center gap-x-2 mb-2">
                                            <AnimtaedLoader
                                                shouldAnimate={loading}
                                                className="h-4 w-4"
                                            />
                                            <span>Processing your request...</span>
                                        </div>
                                        <BuilderChatSystemMessage message={message} />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div className="flex items-center justify-center w-full py-4 px-6 flex-shrink-0">
                <BuilderChatInput />
            </div>
        </div>
    );
}
