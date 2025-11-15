import { ClientDocsPanel } from '@/src/types/docs-types';
import ClientGettingStarted from './ClientGettingStarted';
import ClientHowItWorks from './ClientHowItWorks';
import ClientOverview from './ClientOverview';
import ClientE2B from './ClientE2B';

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
            case ClientDocsPanel.GETTING_STARTED:
                return <ClientGettingStarted />;
            case ClientDocsPanel.SANDBOX:
                return <ClientE2B />;
        }
    }

    return <>{renderPanels()}</>;
}
