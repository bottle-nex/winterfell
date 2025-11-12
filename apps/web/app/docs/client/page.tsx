'use client';
import ClientDocs from '@/src/components/docs/Client/ClientDocs';
import DocsNavbar from '@/src/components/nav/DocsNavbar';

export default function Docs() {
    return (
        <div className="w-full flex flex-col bg-dark-base h-full relative items-center">
            <DocsNavbar />
            <ClientDocs />
        </div>
    );
}
