'use client';
import { cn } from '@/src/lib/utils';
import ClientWorkspaceCard from './ClientWorkspaceCard';
import ClientExpandableSteps from './ClientExpandableCard';
import { LiaSlackHash } from 'react-icons/lia';
import {
    stepsGithubExport,
    stepsPlaygroundOverview,
    stepsShell,
    stepsUpdateContract,
    usePromptCopy,
    stepsBuildYourFirstContract,
    stepsWorkInThePlayground,
    stepsCreateYourAccount,
} from './getting_started_steps';
import DocsHeading from '../../ui/DocsHeading';
import { GettingStartedSubContent } from '@/src/types/docs-types';

export default function ClientGettingStarted() {
    const { promptRef, handleCopy } = usePromptCopy();
    const buildSteps = stepsBuildYourFirstContract(promptRef, handleCopy);
    const updateBuildSteps = stepsWorkInThePlayground(promptRef, handleCopy);

    return (
        <div
            className={cn(
                'w-full flex flex-col gap-y-6 items-start',
                'text-left tracking-wide text-light/90 max-w-[80%] mx-auto',
            )}
        >
            <div className="flex justify-between items-end gap-y-1 px-1 w-full">
                <DocsHeading firstText="Winterfell" secondText="Guide" />
            </div>

            <div className="w-full scroll-mt-8  ">
                <ClientWorkspaceCard
                    title="Root Workspace"
                    redirectLink="winterfell.dev"
                    description="Creating your first contract"
                    imageUrl="/images/winterfell-dashboard.png"
                />
                <div className="w-full px-2 flex flex-col gap-y-2 mt-10">
                    <div className="px-1 tracking-wider text-xl text-light/80 flex items-center gap-x-2">
                        <LiaSlackHash className="rotate-30 text-primary-light" />
                        Start building with Winterfell
                    </div>
                    <div className="w-full border border-neutral-800 rounded-lg overflow-hidden">
                        <ClientExpandableSteps
                            id={GettingStartedSubContent.CREATE_ACCOUNT}
                            title="Create your account"
                            steps={stepsCreateYourAccount}
                        />
                        <ClientExpandableSteps
                            id={GettingStartedSubContent.FIRST_PROMPT}
                            title="Build your first contract"
                            steps={buildSteps}
                        />
                        <ClientExpandableSteps
                            title="Work in the playground"
                            steps={updateBuildSteps}
                        />
                    </div>
                </div>
            </div>

            <div className="w-full scroll-mt-8 mt-10">
                <ClientWorkspaceCard
                    title="Playground Workspace"
                    redirectLink="winterfell.dev/playground/(some-uuid)"
                    description="Update your contract"
                    imageUrl="/images/winterfell-playground.png"
                />
                <div className="w-full px-2 flex flex-col gap-y-2 mt-10">
                    <div className="px-1 tracking-wider text-xl text-light/80 flex items-center gap-x-2">
                        <LiaSlackHash className="rotate-30 text-primary-light" />
                        Explore Playground Workspace
                    </div>
                    <div className="w-full border border-neutral-800 rounded-lg overflow-hidden">
                        <ClientExpandableSteps
                            id={GettingStartedSubContent.PLAYGROUND_OVERVIEW}
                            title="Playground Overview"
                            steps={stepsPlaygroundOverview}
                        />
                        <ClientExpandableSteps
                            id={GettingStartedSubContent.UPDATE_CONTRACT}
                            title="Update Your Contract"
                            steps={stepsUpdateContract}
                        />
                        <ClientExpandableSteps
                            id={GettingStartedSubContent.WINTER_SHELL}
                            title="Using the Winter Shell"
                            steps={stepsShell}
                        />
                        <ClientExpandableSteps
                            id={GettingStartedSubContent.EXPORT_CONTRACT}
                            title="Export to GitHub"
                            steps={stepsGithubExport}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
