'use client';
import BuilderDashboard from '@/src/components/builder/BuilderDashboard';
import BuilderNavbar from '@/src/components/nav/BuilderNavbar';
import { useWebSocket } from '@/src/hooks/useWebSocket';
import { cleanWebSocketClient } from '@/src/lib/singletonWebSocket';
import { useBuilderChatStore } from '@/src/store/code/useBuilderChatStore';
import { useCodeEditor } from '@/src/store/code/useCodeEditor';
import { useTerminalLogStore } from '@/src/store/code/useTerminalLogStore';
import React, { useEffect } from 'react';
import { useChatStore } from '@/src/store/user/useChatStore';

export default function Page({ params }: { params: Promise<{ contractId: string }> }) {
    const { cleanStore } = useBuilderChatStore();
    const { reset, collapseFileTree, setCollapseFileTree } = useCodeEditor();
    const unwrappedParams = React.use(params);
    const { contractId } = unwrappedParams;
    const { addLog } = useTerminalLogStore();
    const { subscribeToHandler } = useWebSocket();
    const { resetContractId } = useChatStore();

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