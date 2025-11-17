import { Button } from '../../ui/button';
import { Step } from './getting_started_steps';
import { BiChevronsRight } from 'react-icons/bi';
import { IoIosPaperPlane } from 'react-icons/io';
import Image from 'next/image';

/**
 * Playground Interface Steps
 *
 * Guides users in understanding the playgroudn interface and
 * winterfell terminal (winter-shell). Covers real-time file generation monitoring and
 * execution of anchor commands through winter's custom shell.
 *
 * @see Step interface from getting_started_steps
 */
export const stepsContextDeployment: Step[] = [
    {
        number: 1,
        title: 'You have got two choices here',
        description: (
            <div className="space-y-1">
                <div className="flex items-center gap-x-1.5">
                    <span>
                        <BiChevronsRight />
                    </span>
                    See the deploy button at the top right, click on the
                    <Button
                        size="mini"
                        className="bg-light text-dark-base hover:bg-light hover:text-dark-base tracking-wider cursor-auto transition-transform hover:-translate-y-0.5 duration-300 font-semibold rounded-[4px]"
                    >
                        <IoIosPaperPlane className="size-3.5" />
                        <span className="text-[11px]">Deploy</span>
                    </Button>
                    button.
                </div>
                <div className="flex items-center gap-x-1.5">
                    <span>
                        <BiChevronsRight />
                    </span>
                    Use the winter shell and run the command from there.
                </div>
                <div className="flex items-center gap-x-1.5">
                    <span>
                        <BiChevronsRight />
                    </span>
                    Refer Winterfell Terminal section of the docs to deploy the contract from winter
                    shell.
                </div>
            </div>
        ),
    },
    {
        number: 2,
        title: 'Connect your wallet',
        description: (
            <div className="flex flex-col">
                You will see an interface with all the wallets that you have, select the one you
                want. Ignore this step if your wallet is already connected.
            </div>
        ),
    },
];

export const stepsDeployContract: Step[] = [
    {
        number: 1,
        title: 'Deploy the contract',
        description: (
            <div className="flex gap-x-1.5 items-center">
                Choose a network to deploy to the
                <div className="h-6 w-6 rounded-sm overflow-hidden relative border border-neutral-700 hover:border-primary/50 hover:-translate-y-0.5 transition-transform duration-300">
                    <Image
                        src={'/images/solanaLogo.png'}
                        alt="solana"
                        fill
                        className="object-fill h-4 w-4 overflow-hidden p-1.5"
                    />
                </div>
                network: Either <span className="font-semibold">mainnet</span> or{' '}
                <span className="font-semibold">devnet</span>.
            </div>
        ),
    },
    {
        number: 2,
        title: 'Deployment Requirements',
        description: (
            <div className="flex items-center gap-x-1.5">
                Make sure you have enough crypto required to deploy the contract to the selected
                network.
            </div>
        ),
    },
    {
        number: 3,
        title: 'Deployment Execution',
        description: (
            <div className="flex items-center gap-x-1.5">
                Wait for some time and winterfell will deploy the contract to your selected network.
            </div>
        ),
    },
    {
        number: 4,
        title: 'Contract credentials',
        description: (
            <div className="flex items-center gap-x-1.5">
                Once the contract is successfully deployed, you will get the credentials of the
                contract eventually. From there you can access your contract and use them.
            </div>
        ),
    },
];
