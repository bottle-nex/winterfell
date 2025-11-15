'use client';
import { useState } from 'react';
import ClientDocsPanelRenderer from './ClientDocsPanelRenderer';
import { ClientDocsPanel } from '@/src/types/docs-types';
import ClientDocsLeftSidebar from './ClientDocsLeftSidebar';
import DocsContentSidebar from '../common/DocsContentSidebar';

export default function ClientDocs() {
    const [clientPanel, setClientPanel] = useState<ClientDocsPanel>(ClientDocsPanel.OVERVIEW);

    function switchPanel(index: number, panel: ClientDocsPanel): void {
        if (index === 0) return;
        setClientPanel(panel);
    }

    return (
        <div className="relative min-h-screen w-full grid grid-cols-[22%_78%] select-none">
            <div className="relative">
                <ClientDocsLeftSidebar switchPanel={switchPanel} />
            </div>
            <div className="w-full pt-18">
                <ClientDocsPanelRenderer clientPanel={clientPanel} />
            </div>
            <div className="relative">
                <DocsContentSidebar
                    contents={content}
                />
            </div>
        </div>
    );
}

const content = [
    'something ',
    'comething'
]