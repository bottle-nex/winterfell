import { ClientDocsPanel } from './ClientDocs';
import ClientGettingStarted from './ClientGettingStarted';
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
            case ClientDocsPanel.GETTING_STARTED:
                return <ClientGettingStarted />;
        }
    }

    return <>{renderPanels()}</>;
}
