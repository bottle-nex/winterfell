import { Button } from '../../ui/button';
import { FaChevronRight } from 'react-icons/fa';
import Image from 'next/image';
import SafariBrowser from '../../ui/SafariBrowser';
import { useState } from 'react';
import { motion } from 'framer-motion';

const overviewPoints = [
    {
        title: 'AI Contracts',
        description: 'Generate and optimize Rust smart contracts instantly.',
        image: '/images/demo-1.jpg',
    },
    {
        title: 'Smart Editor',
        description: 'Edit, refactor, and visualize your Anchor programs easily.',
        image: '/images/demo-2.jpg',
    },
    {
        title: 'One-Click Deployment',
        description: 'Deploy and interact with Solana contracts effortlessly.',
        image: '/images/demo-3.jpg',
    },
];

export default function ClientOverview() {
    const [activeImage, setActiveImage] = useState<string | null>('/images/demo-2.jpg');

    return (
        <div className="py-24 w-full h-full flex flex-col gap-y-20 items-start text-left tracking-wide text-light/90 max-w-[80%] mx-auto">
            <div className="flex flex-col items-start w-full">
                <div className="grid grid-cols-[60%_40%] w-full ">
                    <div className="">
                        <div className="text-7xl flex flex-col items-start justify-center text-center">
                            <div className="flex items-center gap-x-3">
                                <motion.div
                                    initial={{ y: -40, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 0.6 }}
                                    className="font-bold"
                                >
                                    Winterfell
                                </motion.div>
                                <motion.i
                                    transition={{ duration: 0.6 }}
                                    initial={{ x: 40, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    className="font-normal text-primary"
                                >
                                    Docs
                                </motion.i>
                            </div>

                            <motion.span
                                transition={{ duration: 0.6 }}
                                initial={{ x: 40, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                className="mt-2"
                            >
                                Rust Never Sleeps
                            </motion.span>
                        </div>

                        <div className="text-lg text-light/70 tracking-wider max-w-[600px] mt-6">
                            Winterfell is an AI-powered platform that simplifies building, editing,
                            deploying, and interacting with Rust-based Solana smart contracts using
                            Anchor—from AI-assisted contract generation to client SDKs and frontend
                            integration.
                        </div>
                    </div>
                    <div className="relative flex-1 w-full h-full">
                        <Image
                            src="/images/monkey.svg"
                            fill
                            unoptimized
                            alt=""
                            className="rounded-2 object-cover invert scale-125 sepia-[0.3] hue-rotate-20 saturate-[10]"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-center gap-x-5 mt-6">
                    <Button size={'lg'}>
                        <span className="font-semibold">Start generating</span>
                    </Button>
                    <Button
                        size={'lg'}
                        className="flex items-center justify-center gap-x-2 bg-light hover:bg-light/70 text-dark"
                    >
                        <span className="font-semibold">Sign in</span>
                        <FaChevronRight strokeWidth={0.1} />
                    </Button>
                </div>

                <div className="w-full flex gap-x-5 mt-6">
                    {overviewPoints.map((overview, index) => (
                        <StartCards
                            key={overview.title}
                            delay={index / 10}
                            heading={overview.title}
                            description={overview.description}
                            onMouseEnter={() => setActiveImage(overview.image)}
                            onMouseLeave={() => setActiveImage('/images/demo-2.jpg')}
                        />
                    ))}
                </div>
            </div>

            <SafariBrowser className="" url="winterfell.dev/client" imageSrc={activeImage!} />
        </div>
    );
}

interface StartCardsProps {
    heading: string;
    description: string;
    icon?: React.ReactElement;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    delay: number;
}

function StartCards({
    heading,
    description,
    icon,
    delay = 0,
    onMouseEnter,
    onMouseLeave,
}: StartCardsProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.2, ease: 'easeOut' }}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className="flex flex-col max-w-60 items-start gap-y-1 rounded-md border border-neutral-700 bg-dark 
                 px-3 py-2 text-left text-light/80 select-none 
                 transition-transform duration-300 hover:scale-105 hover:shadow-[0_0_10px_2px_rgba(255,255,255,0.1)]"
        >
            <div className="flex items-center gap-x-1.5">
                {icon}
                <span className="font-semibold tracking-wide text-md">{heading}</span>
            </div>
            <p className="text-sm text-light/60 tracking-wide">{description}</p>
        </motion.div>
    );
}
