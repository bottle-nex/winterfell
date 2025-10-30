'use client';
import { GET_CHAT_URL } from '@/routes/api_routes';
import BuilderDashboard from '@/src/components/builder/BuilderDashboard';
import BuilderNavbar from '@/src/components/nav/BuilderNavbar';
import { useWebSocket } from '@/src/hooks/useWebSocket';
import { cleanWebSocketClient } from '@/src/lib/singletonWebSocket';
import { useBuilderChatStore } from '@/src/store/code/useBuilderChatStore';
import { useCodeEditor } from '@/src/store/code/useCodeEditor';
import { useTerminalLogStore } from '@/src/store/code/useTerminalLogStore';
import { useUserSessionStore } from '@/src/store/user/useUserSessionStore';
import axios from 'axios';
import { useChatStore } from '@/src/store/user/useChatStore';
import React, { useEffect } from 'react';

export default function Page({ params }: { params: Promise<{ contractId: string }> }) {
    const { cleanStore, loading } = useBuilderChatStore();
    const { reset, collapseFileTree, setCollapseFileTree } = useCodeEditor();
    const unwrappedParams = React.use(params);
    const { contractId } = unwrappedParams;
    const { addLog } = useTerminalLogStore();
    const { subscribeToHandler } = useWebSocket();
    const { resetContractId } = useChatStore();
    const { session } = useUserSessionStore();
    const { upsertMessage } = useBuilderChatStore();
    const { parseFileStructure } = useCodeEditor();

    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            if ((event.metaKey || event.ctrlKey) && event.key === 'e') {
                event.preventDefault();
                setCollapseFileTree(!collapseFileTree);
            }
        }
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    });

    function handleIncomingTerminalLogs(logs: string) {
        addLog(logs);
    }

    async function get_chat() {
        try {
            if (!session?.user.token) return;

            const { data } = await axios.post(
                GET_CHAT_URL,
                {
                    contractId: contractId,
                },
                {
                    headers: {
                        Authorization: `Bearer ${session.user.token}`,
                    },
                },
            );

            for (let i = 0; i < data.messages.length; i++) {
                upsertMessage(data.messages[i]);
            }

            const parsedFiles = JSON.parse(data.contractFiles);

            if (parsedFiles) {
                parseFileStructure(parsedFiles);
            }
            setCollapseFileTree(true);
        } catch (error) {
            console.error('Error while fetching chats from server: ', error);
        }
    }

    useEffect(() => {
        if (loading) return;
        get_chat();
        //
    }, [contractId, session]);

    useEffect(() => {
        subscribeToHandler(handleIncomingTerminalLogs);
        return () => {
            cleanStore();
            resetContractId();
            reset();
            cleanWebSocketClient();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contractId]);

    return (
        <div className="h-screen w-screen flex flex-col overflow-hidden">
            <BuilderNavbar />
            <div className="flex-1 min-h-0 flex flex-col">
                <BuilderDashboard />
            </div>
        </div>
    );
}
