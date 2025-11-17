'use client';
import { JSX } from 'react';
import DocsHeading from '../../ui/DocsHeading';
import { cn } from '@/src/lib/utils';
import ClientWorkspaceCard from './ClientWorkspaceCard';
import { LiaSlackHash } from 'react-icons/lia';
import ClientExpandableSteps from './ClientExpandableCard';
import { stepsContextDeployment, stepsDeployContract } from './deployment_steps';

export default function ClientDocsDeployments(): JSX.Element {
    return (
        <div
            className={cn(
                'w-full flex flex-col gap-y-6 items-start',
                'text-left tracking-wide text-light/90 max-w-[80%] mx-auto',
            )}
        >
            <div className="flex justify-between items-end gap-y-1 px-1 w-full">
                <DocsHeading firstText="Winterfell" secondText="Deployments" />
            </div>

            <ClientWorkspaceCard
                title="Playground Workspace"
                redirectLink="winterfell.dev"
                description="Deploying the contract to the solana network"
                imageUrl="/images/demo-3.jpg"
            />

            <div className="w-full px-2 flex flex-col gap-y-2 mt-10">
                <div className="px-1 tracking-wider text-xl text-light/80 flex items-center gap-x-2">
                    <LiaSlackHash className="rotate-30 text-primary-light" />
                    Guide to deploy the contract
                </div>
                <div className="w-full border border-neutral-800 rounded-lg overflow-hidden">
                    <ClientExpandableSteps title="Context" steps={stepsContextDeployment} />
                    <ClientExpandableSteps
                        title="Contract Deployment"
                        steps={stepsDeployContract}
                    />
                </div>
            </div>
        </div>
    );
}
