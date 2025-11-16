
import ClientDocsE2BDetails from "./ClientDocsE2BDetails";
import ClientE2BBento from "./ClientE2BBento";
import DocsHeading from "../../ui/DocsHeading";
export default function ClientE2B() {
    return (
        <div className="relative w-full px max-w-[80%] mx-auto">
            <DocsHeading firstText="Winter's" secondText='Runtime' />
            <ClientDocsE2BDetails />
            <ClientE2BBento />
        </div>
    )
}