import { IoCopy } from 'react-icons/io5';
import { ArrowRight } from 'lucide-react';
import { MdTerminal } from 'react-icons/md';
import { FaGithub, FaGoogle } from 'react-icons/fa';
import { HiPencil } from 'react-icons/hi2';
import { ReactNode, Ref, useRef } from 'react';
import ToolTipComponent from '../../ui/TooltipComponent';
import { Button } from '../../ui/button';

export interface Step {
    number: number;
    title: string;
    description: string | ReactNode;
}

export const stepsCreateYourAccount: Step[] = [
    {
        number: 1,
        title: 'Open Winterfell',
        description: (
            <div className="flex flex-col gap-y-3">
                <p className="text-light/70 text-sm">Navigate to Winterfell to get started</p>
                <a
                    href="https://winterfell.dev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-light hover:text-primary transition-colors font-semibold text-sm underline decoration-primary-light/30 hover:decoration-primary w-fit"
                >
                    winterfell.dev →
                </a>
            </div>
        ),
    },
    {
        number: 2,
        title: 'Sign In / Sign Up',
        description: (
            <div className="flex flex-col gap-y-3">
                <p className="text-light/70 text-sm">
                    Use Google or GitHub to authenticate. If already logged in, this step is
                    skipped.
                </p>
                <div className="flex flex-col gap-y-2.5 w-full max-w-sm">
                    <Button className="bg-white hover:bg-light/95 text-dark-base px-4 py-2.5 rounded-[4px] font-semibold text-sm flex items-center justify-center gap-x-2.5 w-full transition-all hover:-translate-y-0.5 border border-light/20 shadow-sm">
                        <FaGoogle className="w-4 h-4" />
                        <span>Continue with Google</span>
                    </Button>
                    <Button className="bg-[#24292e] hover:bg-[#1a1e22] text-white px-4 py-2.5 rounded-[4px] font-semibold text-sm flex items-center justify-center gap-x-2.5 w-full transition-all hover:-translate-y-0.5 shadow-sm">
                        <FaGithub className="w-4 h-4" />
                        <span>Continue with GitHub</span>
                    </Button>
                </div>
                <p className="text-xs text-light/50">
                    By signing in, you agree to our Terms of Service and Privacy Policy.
                </p>
            </div>
        ),
    },
];

export const stepsBuildYourFirstContract = (
    promptRef: Ref<HTMLDivElement>,
    handleCopy: () => void,
) => [
    {
        number: 1,
        title: 'Paste the starter prompt',
        description: 'Copy the provided starter prompt and paste it inside the input box.',
    },
    {
        number: 2,
        title: 'Starter Prompt',
        description: (
            <>
                <div ref={promptRef} className="flex items-center gap-x-2 group">
                    Create a counter program
                    <ToolTipComponent content="copy">
                        <span
                            className="opacity-0 group-hover:opacity-100 transition-opacity transform duration-200 cursor-pointer"
                            onClick={handleCopy}
                        >
                            <IoCopy className="" />
                        </span>
                    </ToolTipComponent>
                </div>
            </>
        ),
    },
    {
        number: 3,
        title: 'Submit the prompt',
        description: (
            <>
                <div className="flex items-center gap-x-1.5">
                    Submit the prompt by either pressing{' '}
                    <Button variant="docs" size="mini">
                        Enter
                    </Button>{' '}
                    or clicking on
                    <Button variant="docs" size="mini">
                        <ArrowRight className="size-3.5 inline-block text-light/80" />
                    </Button>{' '}
                    button
                </div>
            </>
        ),
    },
    {
        number: 4,
        title: 'Access the playground',
        description: 'You will be automatically redirected to the playground page.',
    },
    {
        number: 5,
        title: 'Generation in progress',
        description: 'Wait a few minutes and Winterfell will start generating your contract files.',
    },
];

export const stepsWorkInThePlayground = (
    promptRef: Ref<HTMLDivElement>,
    handleCopy: () => void,
) => [
    {
        number: 1,
        title: 'Watch contract generation',
        description: 'Your contract files appear in real-time inside the playground.',
    },
    {
        number: 2,
        title: 'Update your contract',
        description:
            'Write an update prompt and paste it into the input box to refine your contract.',
    },
    {
        number: 3,
        title: 'Update Prompt',
        description: (
            <>
                <div ref={promptRef} className="flex items-center gap-x-2 group">
                    Update the counter program with more instructions and update the test files.
                    <ToolTipComponent content="copy">
                        <span
                            className="opacity-0 group-hover:opacity-100 transition-opacity transform duration-200 cursor-pointer"
                            onClick={handleCopy}
                        >
                            <IoCopy className="" />
                        </span>
                    </ToolTipComponent>
                </div>
            </>
        ),
    },
    {
        number: 4,
        title: 'Submit your updates',
        description: (
            <>
                <div className="flex items-center gap-x-1.5">
                    Press{' '}
                    <Button variant="docs" size="mini">
                        Enter
                    </Button>{' '}
                    or click on{' '}
                    <Button variant="docs" size="mini" className="px-1.5 h-6">
                        <ArrowRight className="size-3.5 inline-block text-light/80" />
                    </Button>{' '}
                    button to submit changes.
                </div>
            </>
        ),
    },
];

// playgroun-workspace
export const stepsShell: Step[] = [
    {
        number: 1,
        title: 'Open Winter Shell',
        description: (
            <div className="flex items-center gap-x-1.5">
                Press{' '}
                <Button variant="docs" size="mini">
                    Ctrl + J
                </Button>{' '}
                or click{' '}
                <Button variant="docs" size="mini">
                    <MdTerminal className="inline-block text-light/80" />{' '}
                </Button>
                to open the shell.
            </div>
        ),
    },
    {
        number: 2,
        title: 'Explore commands',
        description: (
            <div className="flex items-center gap-x-1.5">
                Type <span className="font-semibold">--help</span> inside the shell to explore all
                commands.
            </div>
        ),
    },
    {
        number: 3,
        title: 'View command list',
        description: (
            <div>
                <span className=" font-semibold">--commands</span> displays all test, build, and
                deploy commands.
            </div>
        ),
    },
    {
        number: 4,
        title: 'Run tests',
        description: (
            <div className="flex items-center gap-x-1.5">
                <span className="font-semibold">winter test: </span> runs the contract test suite.
            </div>
        ),
    },
    {
        number: 5,
        title: 'Build your contract',
        description: (
            <div className="flex items-center gap-x-1.5">
                <span className="font-semibold">winter build: </span> compiles and builds your
                contrac
            </div>
        ),
    },
    {
        number: 6,
        title: 'Deploy your contract',
        description: (
            <div className="flex items-center gap-x-1.5">
                <span className="font-semibold">winter deploy: </span> deploys the contract to the
                solana network.
            </div>
        ),
    },
];

export const stepsGithubExport: Step[] = [
    {
        number: 1,
        title: 'Open Export Panel',
        description: (
            <div className="flex items-center gap-x-1.5">
                Click{' '}
                <Button variant="docs" size="mini" className="flex items-center justify-center">
                    <FaGithub className="size-3.5 inline-block text-light/80" />
                </Button>{' '}
                to open export panel.
            </div>
        ),
    },
    {
        number: 2,
        title: 'Connect GitHub',
        description: 'If not linked, Winterfell will prompt you to connect your GitHub.',
    },
    {
        number: 3,
        title: 'Edit repository name',
        description: (
            <div className="flex items-center gap-x-1.5">
                Rename the repo by clicking{' '}
                <Button className="" variant="docs" size="mini">
                    <HiPencil className="inline-block text-light/80 size-3" />
                </Button>
            </div>
        ),
    },
    {
        number: 4,
        title: 'Export or download',
        description: 'Press Enter to export to GitHub or download the ZIP file.',
    },
];

export const stepsPlaygroundOverview: Step[] = [
    {
        number: 1,
        title: 'Live file generation',
        description: 'Watch your contract files get created in real time.',
    },
    {
        number: 2,
        title: 'Navigate sections',
        description: 'Use the sidebar to explore contract folders & test files.',
    },
];

export const stepsUpdateContract: Step[] = [
    {
        number: 1,
        title: 'Write update prompt',
        description: 'Modify your contract by writing a new prompt in the input box.',
    },
    {
        number: 2,
        title: 'Submit update',
        description: (
            <div className="flex items-center gap-x-1.5">
                Press{' '}
                <Button variant="docs" size="mini">
                    Enter
                </Button>{' '}
                or click{' '}
                <Button variant="docs" size="mini">
                    <ArrowRight className="inline-block size-3.5 text-light/80" />
                </Button>{' '}
                to submit.
            </div>
        ),
    },
    {
        number: 3,
        title: 'Regeneration',
        description: 'Winterfell updates your files instantly based on the new prompt.',
    },
];

export function usePromptCopy() {
    const promptRef = useRef<HTMLDivElement>(null);

    function handleCopy() {
        if (promptRef.current) {
            navigator.clipboard.writeText(promptRef.current.innerText);
        }
    }

    return { promptRef, handleCopy };
}
