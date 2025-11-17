'use client';
import ClientDocsE2BDetails from './ClientDocsE2BDetails';
import DocsHeading from '../../ui/DocsHeading';
import BentoGrid from './BentoGrid';
export default function ClientE2B() {
    return (
        <div className="relative w-full px max-w-[80%] mx-auto">
            <DocsHeading firstText="Winter's" secondText="Runtime" />
            <ClientDocsE2BDetails />
            {/* <ClientE2BBento /> */}
            <BentoGrid />
        </div>
    );
}
