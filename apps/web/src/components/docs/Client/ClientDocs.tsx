'use client';
import { useState } from 'react';
import ClientDocsPanelRenderer from './ClientDocsPanelRenderer';
import ClientDocsLeftSidebar from './ClientDocsLeftSidebar';
import { ClientDocsPanel } from '@/src/types/docs-types';
import { useActiveContentStore } from '@/src/store/docs/useActiveContentStore';
import ClientDocsRightSidebar from './ClientDocsRightSidebar';

export default function ClientDocs() {
    const { activeContent, setActiveContent } = useActiveContentStore();
    const [_activeIndex, setActiveIndex] = useState<number>(0);

    function switchPanel(index: number, clientPanel: ClientDocsPanel) {
        setActiveIndex(index);
        setActiveContent(clientPanel);
    }

    return (
        <div className="relative min-h-screen h-full w-full grid grid-cols-[20%_62%_18%] pb-20">
            <div className="relative">
                <ClientDocsLeftSidebar switchPanel={switchPanel} />
            </div>
            <div className="w-full pt-18">
                <ClientDocsPanelRenderer clientPanel={activeContent} />
            </div>
            <div className="w-full h-full flex items-center">
                <ClientDocsRightSidebar />
            </div>
        </div>
    );
}
