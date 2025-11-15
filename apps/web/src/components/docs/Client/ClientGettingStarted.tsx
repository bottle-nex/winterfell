'use client';
import { cn } from '@/src/lib/utils';
import ClientWorkspaceCard from './ClientWorkspaceCard';
import ClientExpandableSteps from './ClientExpandableCard';
import { LiaSlackHash } from 'react-icons/lia';
import {
    stepsAccount,
    stepsCreateContract,
    stepsGithubExport,
    stepsPlayground,
    stepsPlaygroundOverview,
    stepsPlaygroundTools,
    stepsShell,
    stepsUpdateContract,
} from './getting_started_steps';

export default function ClientGettingStarted() {
    return (
        <div
            className={cn(
                'w-full flex flex-col gap-y-6 items-start',
                'text-left tracking-wide text-light/90 max-w-[80%] mx-auto',
            )}
        >
            <div className="flex justify-between items-end gap-y-1 px-1 w-full">
                <span className="text-3xl">Getting Started</span>
                <span className="text-light/60">
                    Let's kick things off by exploring the interface
                </span>
            </div>

            <ClientWorkspaceCard
                title="Root Workspace"
                redirectLink="winterfell.dev"
                description="Creating your first contract"
                imageUrl="/Images/winterfell-dashboard.png"
            />

            <div className="w-full px-2 flex flex-col gap-y-2 mt-5">
                <div className="px-1 tracking-wider text-xl text-light/80 flex items-center gap-x-2">
                    <LiaSlackHash className="rotate-30 text-primary-light" />
                    Start building with Winterfell
                </div>

                <div className="w-full border border-neutral-800 rounded-lg overflow-hidden">
                    <ClientExpandableSteps title="Create your account" steps={stepsAccount} />
                    <ClientExpandableSteps
                        title="Create your first contract"
                        steps={stepsCreateContract}
                    />
                    <ClientExpandableSteps title="Work in the playground" steps={stepsPlayground} />
                    <ClientExpandableSteps title="Using the Winter Shell" steps={stepsShell} />
                    <ClientExpandableSteps title="Export to GitHub" steps={stepsGithubExport} />
                </div>
            </div>

            <ClientWorkspaceCard
                className="mt-20"
                title="Playground Workspace"
                redirectLink="winterfell.dev/playground/(some-uuid)"
                description="Update your contract"
                imageUrl="/Images/winterfell-playground.png"
            />

            <div className="w-full px-2 flex flex-col gap-y-2 mt-5">
                <div className="px-1 tracking-wider text-xl text-light/80 flex items-center gap-x-2">
                    <LiaSlackHash className="rotate-30 text-primary-light" />
                    Explore Playground Workspace
                </div>

                <div className="w-full border border-neutral-800 rounded-lg overflow-hidden">
                    <ClientExpandableSteps
                        title="Playground Overview"
                        steps={stepsPlaygroundOverview}
                    />
                    <ClientExpandableSteps
                        title="Update Your Contract"
                        steps={stepsUpdateContract}
                    />
                    <ClientExpandableSteps
                        title="Tools: Shell & GitHub"
                        steps={stepsPlaygroundTools}
                    />
                </div>
            </div>
        </div>
    );
}
