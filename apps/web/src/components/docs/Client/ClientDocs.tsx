'use client';
import { useState } from 'react';
import ClientDocsPanelRenderer from './ClientDocsPanelRenderer';
import ClientDocsSidebar from './ClientDocsSidebar';
import { ClientDocsPanel } from '@/src/types/docs-types';

export default function ClientDocs() {
    const [clientPanel, setClientPanel] = useState<ClientDocsPanel>(ClientDocsPanel.OVERVIEW);
    
    function switchPanel(index: number, panel: ClientDocsPanel): void {
        if (index === 0) return;
        setClientPanel(panel);
    }
    
    return (
        <div className="relative min-h-screen w-full grid grid-cols-[78%_22%]">
            <div className="w-full pt-18">
                <ClientDocsPanelRenderer clientPanel={clientPanel} />
            </div>
            <div className="relative">
                <ClientDocsSidebar switchPanel={switchPanel} />
            </div>
        </div>
    );
}