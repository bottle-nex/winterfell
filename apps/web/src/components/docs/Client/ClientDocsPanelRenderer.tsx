import { ClientDocsPanel } from "./ClientDocs";
import ClientOverview from "./ClientOverview";

interface ClientDocsPanelRendererProps {
    clientPanel: ClientDocsPanel
}

export default function ClientDocsPanelRenderer({ clientPanel }: ClientDocsPanelRendererProps) {

    function renderPanels() {
        switch (clientPanel) {
            case ClientDocsPanel.OVERVIEW:
                return <ClientOverview />
        }
    }

    return (
        <>
            {renderPanels()}
        </>
    )
}