'use client';
import BuilderDashboard from '@/src/components/builder/BuilderDashboard';
import BuilderNavbar from '@/src/components/nav/BuilderNavbar';
import { useBuilderChatStore } from '@/src/store/code/useBuilderChatStore';
import { useCodeEditor } from '@/src/store/code/useCodeEditor';
import { useChatStore } from '@/src/store/user/useChatStore';
import React, { useEffect } from 'react';

export default function Page({ params }: { params: Promise<{ contractId: string }> }) {
    const { cleanStore } = useBuilderChatStore();
    const { reset, collapseFileTree, setCollapseFileTree } = useCodeEditor();
    const unwrappedParams = React.use(params);
    const { contractId } = unwrappedParams;
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

    useEffect(() => {
        return () => {
            resetContractId();
            cleanStore();
            reset();
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
