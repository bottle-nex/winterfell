'use client';
import { cn } from '@/src/lib/utils';
import ClientWorkspaceCard from './ClientWorkspaceCard';
import ClientExpandableSteps from './ClientExpandableCard';
import { LiaSlackHash } from 'react-icons/lia';
import DocsHeading from '../../ui/DocsHeading';
import { WinterShellSubContent } from '@/src/types/docs-types';
import { stepsContext, stepsRunCommands } from './winter_shell_steps';

export default function ClientDocsWinterShell() {
    return (
        <div
            className={cn(
                'w-full flex flex-col gap-y-6 items-start',
                'text-left tracking-wide text-light/90 max-w-[80%] mx-auto',
            )}
        >
            <div className="flex justify-between items-end gap-y-1 px-1 w-full">
                <DocsHeading firstText="Winter's" secondText="Terminal" />
            </div>

            <div id={WinterShellSubContent.WINTER_SHELL_INFO} className="w-full scroll-mt-8  ">
                <ClientWorkspaceCard
                    title="Playground Workspace"
                    redirectLink="winterfell.dev"
                    description="Understanding and updating the contract"
                    imageUrl="/images/winterfell-terminal.png"
                />
                <div className="w-full px-2 flex flex-col gap-y-2 mt-10">
                    <div className="px-1 tracking-wider text-xl text-light/80 flex items-center gap-x-2">
                        <LiaSlackHash className="rotate-30 text-primary-light" />
                        Guide to use winter shell
                    </div>
                    <div className="w-full border border-neutral-800 rounded-lg overflow-hidden">
                        <ClientExpandableSteps title="Context" steps={stepsContext} />
                        <ClientExpandableSteps
                            title="Anchor commands execution"
                            steps={stepsRunCommands}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
