'use client';
import ClientDocs from '@/src/components/docs/Client/ClientDocs';
import DocsNavbar from '@/src/components/nav/DocsNavbar';
import AppLogo from '@/src/components/tickers/AppLogo';

export default function Docs() {
    return (
        <div className="min-h-screen w-full flex flex-col bg-dark-base relative items-center">
            <div className="absolute top-8 left-8">
                <AppLogo />
            </div>
            <DocsNavbar />
            <ClientDocs />
        </div>
    );
}
