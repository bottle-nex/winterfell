import { ClientDocsPanel } from '@/src/types/docs-types';
import ClientHowItWorks from './ClientHowItWorks';
import ClientOverview from './ClientOverview';

interface ClientDocsPanelRendererProps {
    clientPanel: ClientDocsPanel;
}

export default function ClientDocsPanelRenderer({ clientPanel }: ClientDocsPanelRendererProps) {
    function renderPanels() {
        switch (clientPanel) {
            case ClientDocsPanel.OVERVIEW:
                return <ClientOverview />;
            case ClientDocsPanel.HOW_IT_WORKS:
                return <ClientHowItWorks />;
        }
    }

    return <>{renderPanels()}</>;
}
