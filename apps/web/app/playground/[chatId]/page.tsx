'use client';
import BuilderDashboard from '@/src/components/builder/BuilderDashboard';
import BuilderNavbar from '@/src/components/nav/BuilderNavbar';
import { useBuilderChatStore } from '@/src/store/code/useBuilderChatStore';
import React, { useEffect } from 'react';

interface PageProps {
    params: { chatId: string };
}

export default function Page({ params }: { params: Promise<{ chatId: string }>}) {
    const { cleanStore } = useBuilderChatStore();
    const unwrappedParams = React.use(params);
    const { chatId } = unwrappedParams;

    useEffect(() => {
        return () => {
            cleanStore();
        };
    }, [chatId]);

    return (
        <div className="h-screen w-screen flex flex-col overflow-hidden">
            <BuilderNavbar />
            <div className="flex-1 min-h-0 flex flex-col">
                <BuilderDashboard />
            </div>
        </div>
    );
}
