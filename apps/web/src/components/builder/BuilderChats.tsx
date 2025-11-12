'use client';
import BuilderChatInput from './BuilderChatInput';
import { useBuilderChatStore } from '@/src/store/code/useBuilderChatStore';
import Image from 'next/image';
import { useUserSessionStore } from '@/src/store/user/useUserSessionStore';
import { useParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { NEW_CHAT_URL } from '@/routes/api_routes';
import {
    FILE_STRUCTURE_TYPES,
    FileContent,
    PHASE_TYPES,
    STAGE,
    StreamEvent,
} from '@/src/types/stream_event_types';
import SystemMessage from './SystemMessage';
import AppLogo from '../tickers/AppLogo';
import { useCodeEditor } from '@/src/store/code/useCodeEditor';
import { useChatStore } from '@/src/store/user/useChatStore';
import { Message } from '@/src/types/prisma-types';
import { LayoutGrid } from '../ui/animated/layout-grid-icon';
import { TextShimmer } from '../ui/shimmer-text';

export default function BuilderChats() {
    const { session } = useUserSessionStore();
    const params = useParams();
    const contractId = params.contractId as string;
    const hasInitialized = useRef<boolean>(false);
    const messageEndRef = useRef<HTMLDivElement>(null);
    const { setCollapseFileTree } = useCodeEditor();
    const { setContractId } = useChatStore();
    const { parseFileStructure, deleteFile } = useCodeEditor();
    const { messages, loading, setLoading, upsertMessage, setPhase, setCurrentFileEditing } =
        useBuilderChatStore();

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
            setContractId(contractId);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contractId]);

    async function startChat(message: string) {
        try {
            setLoading(true);
            const response = await fetch(NEW_CHAT_URL, {
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

            if (!response.ok) {
                throw new Error('Failed to start chat');
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();

            if (!reader) {
                throw new Error('No response body');
            }

            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() ?? ''; // keep the last incomplete chunk

                for (const line of lines) {
                    const trimmed = line.trim();
                    if (!trimmed) continue;

                    try {
                        const jsonString = trimmed.startsWith('data: ')
                            ? trimmed.slice(6)
                            : trimmed;
                        const event: StreamEvent = JSON.parse(jsonString);

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
                            case PHASE_TYPES.DELETING:
                                setPhase(event.type);
                                break;

                            case FILE_STRUCTURE_TYPES.EDITING_FILE:
                                setPhase(event.type);
                                if ('file' in event.data) {
                                    if ('phase' in event.data && event.data.phase === 'deleting') {
                                        deleteFile(event.data.file as string);
                                    } else {
                                        setCurrentFileEditing(event.data.file as string);
                                    }
                                }
                                break;

                            case PHASE_TYPES.ERROR:
                                console.error('LLM Error:', event.data);
                                break;

                            case STAGE.END:
                                if ('data' in event.data && event.data.data) {
                                    parseFileStructure(event.data.data as FileContent[]);
                                }
                                break;

                            default:
                                break;
                        }
                    } catch (error) {
                        console.warn('Skipping incomplete stream event chunk');
                    }
                }
            }

            if (buffer.trim()) {
                try {
                    const jsonString = buffer.startsWith('data: ') ? buffer.slice(6) : buffer;
                    const event: StreamEvent = JSON.parse(jsonString);
                    if (event.type === STAGE.END && 'data' in event.data && event.data.data) {
                        parseFileStructure(event.data.data as FileContent[]);
                    }
                } catch {
                    console.warn('Failed to parse final buffered chunk');
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
                            <div className="flex justify-end items-start w-full">
                                <div className="flex items-start gap-x-2 max-w-[70%]">
                                    <div className="px-4 py-2 rounded-[4px] text-sm font-semibold bg-dark text-light text-right">
                                        {message.content}
                                    </div>
                                    {session?.user.image && (
                                        <Image
                                            className="rounded-full flex-shrink-0"
                                            src={session.user.image}
                                            alt="user"
                                            width={32}
                                            height={32}
                                        />
                                    )}
                                </div>
                            </div>
                        )}
                        {message.role === 'AI' && (
                            <div className="flex justify-start w-full">
                                <div className="flex items-start gap-x-2 max-w-[70%]">
                                    <AppLogo showLogoText={false} size={22} />
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
                                            <div className="flex items-center gap-x-1 mb-2">
                                                <LayoutGrid
                                                    shouldAnimate={loading}
                                                    className="h-4 w-4"
                                                />
                                                <TextShimmer>
                                                    Processing your request...
                                                </TextShimmer>
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
