import DevDocs from '@/src/components/docs/Dev/DevDocs';
import DocsNavbar from '@/src/components/nav/DocsNavbar';

export default function Docs() {
    return (
        <div className="min-h-screen w-full flex flex-col bg-dark-base relative items-center">
            <DocsNavbar />
            <DevDocs />
        </div>
    );
}
