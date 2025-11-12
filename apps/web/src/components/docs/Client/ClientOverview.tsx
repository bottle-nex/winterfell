import { TerminalIcon } from 'lucide-react';
import { MdRocketLaunch } from 'react-icons/md';
import { PiExportFill } from 'react-icons/pi';

export default function ClientOverview() {
    return (
        <div className="pt-12 w-full h-full flex flex-col items-start text-left tracking-wide text-light/90 gap-y-2 max-w-[70%] mx-auto">
            <div className="text-3xl">Overview</div>

            <span className="text-light/70 tracking-wider leading-[1.4]">
                Winterfell is an AI-powered platform for building, editing, deploying, and
                interacting with Rust-based smart contracts on Solana using Anchor. It aims to
                simplify the entire smart contract workflow, from AI-assisted contract generation to
                client SDK creation and frontend integration.
            </span>

            <div className="relative h-[28rem] w-full bg-light/80 mt-4 flex flex-col justify-center items-center gap-y-1 tracking-wider text-dark overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/50 to-transparent opacity-20" />
                <div className="relative z-10 text-center">
                    <span className="block text-5xl font-semibold drop-shadow-2xl">
                        Winterfell.Dev
                    </span>
                    <span className="block text-2xl drop-shadow-2xl">
                        AI powered smart contract generator
                    </span>
                </div>
            </div>

            <div className="w-full flex mt-3 gap-x-5">
                <StartCards
                    heading="Start building"
                    description="Create your first smart contract with winterfell.dev"
                    icon={<MdRocketLaunch />}
                />

                <StartCards
                    heading="Build/ Deploy"
                    description="Compile, build and deploy using winter shell"
                    icon={<TerminalIcon size={14} />}
                />

                <StartCards
                    heading="Export"
                    description="Download/ Export your code to GitHub"
                    icon={<PiExportFill size={15} />}
                />
            </div>
        </div>
    );
}

interface StartCardsProps {
    heading: string;
    description: string;
    icon: React.ReactElement;
}

function StartCards({ heading, description, icon }: StartCardsProps) {
    return (
        <div
            className="flex flex-col max-w-[15rem] text-light/80 items-start gap-y-1 border border-neutral-700 px-3 py-2 rounded-[6px] text-left 
            transition-all duration-300 transform select-none hover:shadow-[0_0_10px_2px_rgba(255,255,255,0.15)]"
        >
            <div className="flex gap-x-1.5 items-center">
                {icon}
                <span className="font-semibold tracking-wider text-[14px]">{heading}</span>
            </div>
            <div className="text-[13px] text-light/60 tracking-wider">{description}</div>
        </div>
    );
}
