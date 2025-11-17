import { Step } from './getting_started_steps';
import { MdTerminal } from 'react-icons/md';
import { BiChevronsRight } from 'react-icons/bi';
import { Button } from '../../ui/button';

/**
 * Playground Interface Steps
 *
 * Guides users in understanding the playgroudn interface and
 * winterfell terminal (winter-shell). Covers real-time file generation monitoring and
 * execution of anchor commands through winter's custom shell.
 *
 * @see Step interface from getting_started_steps
 */
export const stepsContext: Step[] = [
    {
        number: 1,
        title: 'Winter shell',
        description: (
            <div>
                {/* <span className="font-semibold">Winter shell</span> */}
                <div className="flex items-center gap-x-1.5">
                    <span>
                        <BiChevronsRight />
                    </span>
                    Winterfell has its own custom terminal named winter shell.
                </div>
                <div className="flex items-center gap-x-1.5">
                    <span>
                        <BiChevronsRight />
                    </span>
                    This is the place where you run your anchor commands.
                </div>
            </div>
        ),
    },
    {
        number: 2,
        title: 'Navigation',
        description: (
            <div className="flex flex-col">
                <span className="font-semibold">optional: </span>
                <div className="flex items-center gap-x-1.5">
                    <span>
                        <BiChevronsRight />
                    </span>
                    Once you are done with all the updates in the contract.
                </div>
                <div className="flex items-center gap-x-1.5">
                    <span>
                        <BiChevronsRight />
                    </span>
                    <div>
                        Click on the searchbar at the top or Press{' '}
                        <span>
                            <Button
                                className="tracking-widest text-light/80"
                                variant={'docs'}
                                size={'mini'}
                            >
                                {'⌘ + K'}
                            </Button>
                        </span>{' '}
                        to navigate through the files.
                    </div>
                </div>
            </div>
        ),
    },
    {
        number: 3,
        title: 'Open the terminal',
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
        number: 4,
        title: 'Explore the interface',
        description: (
            <div className="flex items-center gap-x-1.5">
                Type <span className="font-semibold">--help</span> inside the shell to explore all
                commands.
            </div>
        ),
    },
    {
        number: 5,
        title: 'Winter commands',
        description: (
            <div className="flex items-center gap-x-1.5">
                <span className="font-semibold">--commands</span> gives you all the commands needed
                to make your contract deploy ready.
            </div>
        ),
    },
];

export const stepsRunCommands: Step[] = [
    {
        number: 1,
        title: 'Test command',
        description: (
            <div className="flex items-center gap-x-1.5">
                <span className="font-semibold">winter test: </span> runs the contract test files.
            </div>
        ),
    },
    {
        number: 2,
        title: 'Build command',
        description: (
            <div className="flex items-center gap-x-1.5">
                <span className="font-semibold">winter build: </span> compiles and builds your
                contract
            </div>
        ),
    },
    {
        number: 3,
        title: 'Deploy command',
        description: (
            <div className="flex flex-col gap-y-1">
                <span className="font-semibold">winter deploy: </span>
                <div className="flex items-center gap-x-1.5">
                    <span>
                        <BiChevronsRight />
                    </span>
                    If your wallet is not connected, you will be asked to connect your crypto wallet
                    first.
                </div>
                <div className="flex items-center gap-x-1.5">
                    <span>
                        <BiChevronsRight />
                    </span>
                    Run the command{' '}
                    <span className="font-semibold">
                        {'['} winter deploy {']'}
                    </span>{' '}
                    again.
                </div>
                <div className="flex items-center gap-x-1.5">
                    <span>
                        <BiChevronsRight />
                    </span>
                    Winter asks you to select a network:{' '}
                    <span className="font-semibold">Devnet</span> or{' '}
                    <span className="font-semibold tracking-wider">Mainnet</span>
                </div>
                <div className="flex items-center gap-x-1.5">
                    <span>
                        <BiChevronsRight />
                    </span>
                    Press Enter and you are good to go.
                </div>
            </div>
        ),
    },
    {
        number: 4,
        title: 'Command execution',
        description: (
            <div>
                You will see the loader, once you execute the command. Wait for some time after the
                execution.
            </div>
        ),
    },
    {
        number: 5,
        title: 'Command execution logs',
        description: (
            <div>
                Test and Build execution status will be streamed live in the shell eventually.
            </div>
        ),
    },
];
