import { TerminalIcon } from 'lucide-react';
import { MdRocketLaunch } from 'react-icons/md';
import { PiExportFill } from 'react-icons/pi';
import { MeshGradient } from '@paper-design/shaders-react';
import { Button } from '../../ui/button';
import { FaChevronRight } from 'react-icons/fa';

export default function ClientOverview() {
    return (
        <div className="pt-12 w-full h-full flex flex-col items-start text-left tracking-wide text-light/90 gap-y-2 max-w-[70%] mx-auto">
            <div className='text-8xl font-bold'>The next gen of notes & docs</div>
            <div className='text-xl text-light/70'>Winterfell is an AI-powered platform that simplifies building, editing, deploying, and interacting with Rust-based Solana smart contracts using Anchor from AI-assisted contract generation to client SDKs and frontend integration.</div>
            <div className='flex items-center justify-center gap-x-5'>
                <Button size={'lg'}>
                    <span className='font-semibold'>Start generating</span>
                </Button>
                <Button size={'lg'} className='flex items-center justify-center gap-x-2 bg-light hover:bg-light/70 text-dark'>
                    <span className='font-semibold'>Sign in</span>
                    <FaChevronRight strokeWidth={0.1} />
                </Button>
            </div>
            <div className="w-full flex gap-x-5 mt-6">
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
            <div className="relative h-[30rem] w-full bg-light/80 mt-3 flex flex-col justify-center items-center gap-y-1 tracking-wider text-dark overflow-hidden">
                <MeshGradient
                    colors={['#5100ff', '#00ff80', '#6C44FC', '#141517']}
                    distortion={1}
                    swirl={0.8}
                    speed={0.2}
                    style={{ width: "100%", height: '100%' }}
                />
                <div className="absolute z-10 text-center h-full w-full flex flex-col justify-center items-center text-light">
                    <span className="block text-5xl font-semibold drop-shadow-2xl">
                        Winterfell.Dev
                    </span>
                    <span className="block text-2xl drop-shadow-2xl">
                        AI powered smart contract generator
                    </span>
                </div>
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
