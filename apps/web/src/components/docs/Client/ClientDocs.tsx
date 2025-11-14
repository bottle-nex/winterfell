'use client';
import { useState } from 'react';
import ClientDocsPanelRenderer from './ClientDocsPanelRenderer';
import ClientDocsSidebar from './ClientDocsSidebar';
import { ClientDocsPanel } from '@/src/types/docs-types';

export default function ClientDocs() {
    const [clientPanel, setClientPanel] = useState<ClientDocsPanel>(ClientDocsPanel.OVERVIEW);

    return (
        <div className="relative min-h-screen w-full grid grid-cols-[80%_20%]">
            <div className="w-full">
                <ClientDocsPanelRenderer clientPanel={clientPanel} />
            </div>
            <ClientDocsSidebar setClientPanel={setClientPanel} />
        </div>
    );
}
