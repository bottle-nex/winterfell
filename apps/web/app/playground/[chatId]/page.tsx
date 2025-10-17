'use client';

import BuilderDashboard from '@/src/components/builder/BuilderDashboard';
import BuilderNavbar from '@/src/components/nav/BuilderNavbar';

interface PageProps {
    params: { chatId: string };
}

export default function Page({ params }: PageProps) {
    return (
        <div className="h-screen w-screen relative overflow-hidden flex flex-col">
            <BuilderNavbar />
            <BuilderDashboard />
        </div>
    );
}
