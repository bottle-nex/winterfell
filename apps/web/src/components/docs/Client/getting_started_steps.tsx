import { IoReturnDownBackSharp } from 'react-icons/io5';
import { ArrowRight } from 'lucide-react';
import { MdTerminal } from 'react-icons/md';
import { FaGithub } from 'react-icons/fa';
import { HiPencil } from 'react-icons/hi2';
import { ReactNode } from 'react';

export interface Step {
    number: number;
    title: string;
    description: string | ReactNode;
}

// root-workspace potins

export const stepsAccount: Step[] = [
    {
        number: 1,
        title: 'Open Winterfell',
        description: (
            <>
                Visit{' '}
                <span className="text-primary-light cursor-pointer hover:text-primary transition-colors">
                    winterfell.dev
                </span>{' '}
                to begin.
            </>
        ),
    },
    {
        number: 2,
        title: 'Sign in / Sign up',
        description:
            'Use Google or GitHub to authenticate. If already logged in, this step is skipped.',
    },
];

export const stepsCreateContract: Step[] = [
    {
        number: 1,
        title: 'Paste the starter prompt',
        description: 'Copy the provided starter prompt and paste it inside the input box.',
    },
    {
        number: 2,
        title: 'Submit the prompt',
        description: (
            <>
                Press <IoReturnDownBackSharp className="inline-block text-light/80" /> or click{' '}
                <ArrowRight className="inline-block text-light/80" /> to submit.
            </>
        ),
    },
    {
        number: 3,
        title: 'Access the playground',
        description: 'You will be automatically redirected to the playground page.',
    },
    {
        number: 4,
        title: 'Generation in progress',
        description: 'Wait a few minutes and Winterfell will start generating your contract files.',
    },
];

export const stepsPlayground: Step[] = [
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
        title: 'Submit your updates',
        description: (
            <>
                Press <IoReturnDownBackSharp className="inline-block text-light/80" /> or click{' '}
                <ArrowRight className="inline-block text-light/80" /> to submit changes.
            </>
        ),
    },
];

export const stepsShell: Step[] = [
    {
        number: 1,
        title: 'Open Winter Shell',
        description: (
            <>
                Press <span className="text-light/80">Ctrl + J</span> or click{' '}
                <MdTerminal className="inline-block text-light/80" /> to open the shell.
            </>
        ),
    },
    {
        number: 2,
        title: 'Explore commands',
        description: 'Type --help inside the shell to explore all commands.',
    },
    {
        number: 3,
        title: 'View command list',
        description: '--commands displays all test, build, and deploy commands.',
    },
    {
        number: 4,
        title: 'Run tests',
        description: 'winter test — runs the contract test suite.',
    },
    {
        number: 5,
        title: 'Build your contract',
        description: 'winter build — compiles and builds your contract.',
    },
    {
        number: 6,
        title: 'Deploy your contract',
        description: 'winter deploy — deploys your contract to devnet or mainnet.',
    },
];

export const stepsGithubExport: Step[] = [
    {
        number: 1,
        title: 'Open Export Panel',
        description: (
            <>
                Click <FaGithub className="inline-block text-light/80" /> to open export panel.
            </>
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
            <>
                Rename the repo by clicking{' '}
                <HiPencil className="inline-block text-light/80 size-3" />.
            </>
        ),
    },
    {
        number: 4,
        title: 'Export or download',
        description: 'Press Enter to export to GitHub or download the ZIP file.',
    },
];

// playground-workspace points

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
            <>
                Press <IoReturnDownBackSharp className="inline-block text-light/80" /> or click{' '}
                <ArrowRight className="inline-block text-light/80" /> to submit.
            </>
        ),
    },
    {
        number: 3,
        title: 'Regeneration',
        description: 'Winterfell updates your files instantly based on the new prompt.',
    },
];

export const stepsPlaygroundTools: Step[] = [
    {
        number: 1,
        title: 'Open Winter Shell',
        description: (
            <>
                Press <span className="text-light/80">Ctrl + J</span> or click{' '}
                <MdTerminal className="inline-block text-light/80" /> to open it.
            </>
        ),
    },
    {
        number: 2,
        title: 'Run commands',
        description: (
            <>
                Use <span className="text-light/80">--help</span> or{' '}
                <span className="text-light/80">--commands</span> to see all commands.
            </>
        ),
    },
    {
        number: 3,
        title: 'Test / Build / Deploy',
        description:
            'Use `winter test`, `winter build`, and `winter deploy` to manage your project.',
    },
    {
        number: 4,
        title: 'Export to GitHub',
        description: (
            <>
                Click <FaGithub className="inline-block text-light/80" /> to export your workspace.
            </>
        ),
    },
];
