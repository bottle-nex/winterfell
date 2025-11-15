import { cn } from '@/src/lib/utils';
import WorkspaceCard from '../common/WorkspaceCard';
import { Highlighter } from '../../ui/highlighter';
import { useRouter } from 'next/navigation';
import { IoCopy, IoReturnDownBackSharp } from 'react-icons/io5';
import { useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import ToolTipComponent from '../../ui/TooltipComponent';
import { MdTerminal } from 'react-icons/md';
import { FaGithub } from 'react-icons/fa';
import { HiPencil } from 'react-icons/hi2';

export default function ClientGettingStarted() {
    const router = useRouter();
    const promptRef = useRef<HTMLDivElement>(null);
    const [copied, setCopied] = useState<boolean>(false);
    const updateRef = useRef<HTMLDivElement>(null);

    function handleCopy() {
        if (promptRef.current) {
            navigator.clipboard.writeText(promptRef.current.innerText);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    }

    function handleCopyUpdatePrompt() {
        if (updateRef.current) {
            navigator.clipboard.writeText(updateRef.current.innerText);
        }
    }

    return (
        <div
            className={cn(
                'py-24 w-full flex flex-col gap-y-6 items-start',
                'text-left tracking-wide text-light/90 max-w-[80%] mx-auto',
            )}
        >
            <div className={cn('flex justify-between items-end gap-y-1 px-1 w-full')}>
                <span className={cn('text-3xl')}>Getting Started</span>
                <span className="text-light/60">
                    Let's kick things off by exploring the interface
                </span>
            </div>

            <WorkspaceCard
                title="Root Workspace"
                redirectLink="winterfell.dev"
                description="Creating your first contract"
                imageUrl="/Images/winterfell-dashboard.png"
            />

            {/* phase 1: creating contract - root workspace */}
            <div className="w-full flex flex-col justify-start mt-10 gap-y-4 px-4">
                <div className="flex items-center gap-x-3 h-fit">
                    <div className="w-2 h-2 bg-white drop-shadow-2xl border rounded-full shadow-[0_0_8px_3px_rgba(255,255,255,0.4)]" />
                    <div className="min-w-fit text-light">Create your first contract</div>
                </div>

                <div className="flex flex-col text-light/60 pl-4 max-w-[75%] text-sm tracking-wider">
                    <div className="space-y-2">
                        <div className="flex gap-x-2">
                            <span>1.</span> Open{' '}
                            <span
                                onClick={() => router.push('/')}
                                className="font-semibold hover:text-light/80 transition-colors transform duration-300 cursor-pointer"
                            >
                                <Highlighter action="underline" color="#805999" padding={0}>
                                    winterfell.dev
                                </Highlighter>
                            </span>{' '}
                            in a new tab.
                        </div>

                        <div className="flex gap-x-2">
                            <span>2.</span> In the input-box, paste this:
                        </div>

                        <div
                            ref={promptRef}
                            className="ml-5 px-5 text-light/70 bg-dark py-3 rounded-lg relative max-w-[60%] group"
                        >
                            Build an upgradeable smart contract system with multi-tier
                            subscriptions, recurring payments, NFT membership, coupons, revenue
                            sharing, access control, factory + proxy, and full tests.
                            <div
                                onClick={handleCopy}
                                className="absolute bottom-1.5 right-1.5 flex items-center text-sm gap-x-1 bg-dark-base px-1.5 py-0.5 rounded-sm cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity transform duration-200"
                            >
                                <IoCopy className="size-3" />
                                <span>{copied ? 'copied' : 'copy'}</span>
                            </div>
                        </div>

                        <div className="flex gap-x-2">
                            <span>3. </span>Click the white arrow to submit.
                        </div>
                        <div className="flex gap-x-2">
                            <span>4. </span>Sign in or sign up (Google, GitHub - no credit card
                            required). You won’t see this step if you’re already logged in.
                        </div>
                        <div className="flex gap-x-2">
                            <span>5. </span>You will be redirected to the{' '}
                            <span className="text-light">playground</span> page
                        </div>
                        <div className="flex gap-x-2">
                            <span>6. </span>Wait a few minutes and you'll see winterfell generating
                            the files simultaneously.
                        </div>
                        <div className="flex gap-x-2">
                            <span>7. </span>You can try out templates as well
                        </div>
                    </div>
                </div>
            </div>

            <WorkspaceCard
                className="mt-20"
                title="Playground Workspace"
                redirectLink="winterfell.dev/playground/(some-uuid)"
                description="Update your contract"
                imageUrl="/Images/winterfell-playground.png"
            />

            {/* phase 2: reprompt/ refine contract - playground workspace */}
            <div className="w-full flex justify-between">
                <div className="w-full flex flex-col justify-start mt-10 gap-y-4 px-4">
                    <div className="flex items-center gap-x-3 h-fit">
                        <div className="w-2 h-2 bg-white drop-shadow-2xl border rounded-full shadow-[0_0_8px_3px_rgba(255,255,255,0.4)]" />
                        <div className="min-w-fit text-light">Update/ Refine your contract</div>
                    </div>

                    <div className="flex flex-col text-light/60 pl-4 max-w-[75%] text-sm tracking-wider">
                        <div className="space-y-2">
                            <div className="flex gap-x-2">
                                <span>1.</span>You can see the contract being generated in
                                playground endpoint.
                            </div>

                            <div className="flex gap-x-2">
                                <span>2.</span>To update your contract, paste this in the input box:
                            </div>

                            <div
                                ref={updateRef}
                                className="ml-5 px-5 text-light/70 bg-dark py-3 rounded-lg relative max-w-[60%] group"
                            >
                                Update the contract, add test files and more instructions.
                                <ToolTipComponent content="copy">
                                    <div
                                        onClick={handleCopyUpdatePrompt}
                                        className="absolute top-1/3 right-1 flex items-center text-sm gap-x-1 px-1.5 py-0.5 rounded-sm cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity transform duration-200"
                                    >
                                        <IoCopy className="size-3" />
                                    </div>
                                </ToolTipComponent>
                            </div>

                            <div className="flex gap-x-2 items-center">
                                <span>3. </span>Send the prompt by either pressing{' '}
                                <span>
                                    <IoReturnDownBackSharp className="text-light/80 size-4" />
                                </span>{' '}
                                or clicking the{' '}
                                <span className="text-light/80">
                                    <ArrowRight className="size-4" />
                                </span>{' '}
                                button
                            </div>
                            <div className="flex gap-x-2 items-center">
                                <span>4. </span>Press{' '}
                                <span className="text-light/80">Ctrl + J</span> or Click on the{' '}
                                <span>
                                    <MdTerminal className="text-light/80 size-4" />
                                </span>{' '}
                                icon to open{' '}
                                <span className="text-light/80 bg-dark px-2 rounded-xs cursor-pointer hover:text-light transition-colors transform duration-200">
                                    winter shell
                                </span>
                            </div>
                            <div className="flex gap-x-2">
                                <span>5. </span>Once you are inside the shell, start by typing{' '}
                                <span className="text-light/80 tracking-widest">--help</span> on the
                                shell.
                            </div>
                            <div className="flex gap-x-2">
                                <span>6. </span>
                                <span className="text-light/80 tracking-widest">
                                    --commands
                                </span>{' '}
                                will give you the test, build and deploy commands.
                            </div>
                            <div className="flex gap-x-2">
                                <span>7. </span>
                                <span className="text-light/80">winter test: </span> Runs the test
                                file of your contract
                            </div>
                            <div className="flex gap-x-2">
                                <span>8. </span>
                                <span className="text-light/80">winter build: </span> Runs the build
                                file of your contract
                            </div>
                            <div className="flex gap-x-2">
                                <span>9. </span>
                                <span className="text-light/80">winter deploy: </span> Deploys your
                                contract to the mainnet/ devnet.
                            </div>
                            <div className="flex gap-x-2 items-center">
                                <span>10. </span>To export your codebase to GitHub, click on the{' '}
                                <span>
                                    <FaGithub className="text-light/80" />
                                </span>{' '}
                                on the top right of your screen.
                            </div>
                            <div className="flex gap-x-2 items-center">
                                <span>11. </span>If GitHub is not linked, winterfell will connect
                                you to your GitHub.
                            </div>
                            <div className="flex gap-x-2 items-center">
                                <span>12. </span>Once you are connected to GitHub, edit the
                                repository name by clicking{' '}
                                <span>
                                    <HiPencil className="text-light/80 size-3" />
                                </span>{' '}
                                icon.
                            </div>
                            <div className="flex gap-x-2 items-center">
                                <span>13. </span>Now either Press Enter to export to GitHub or
                                Download the ZIP file.
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border border-neutral-800 h-fit min-w-fit p-1.5 rounded-lg"></div>
            </div>
        </div>
    );
}
