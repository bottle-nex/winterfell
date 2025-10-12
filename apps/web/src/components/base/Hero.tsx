'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, useInView, useScroll, useTransform } from 'framer-motion';
import { Textarea } from '../ui/textarea';
import { cn } from '@/src/lib/utils';
import { Button } from '../ui/button';
import { RiCodeSSlashFill } from 'react-icons/ri';
import City from './City';
import DashboardTicker from '../tickers/DashboardTicker';

export default function Hero() {
    const [showText, setShowText] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState<string>('');

    const heroRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(heroRef, { once: false });
    const controls = useAnimation();

    useEffect(() => {
        if (isInView) {
            controls.start('visible');
        }
    }, [isInView, controls]);

    const { scrollY } = useScroll();
    const fadeOpacity = useTransform(scrollY, [0, 800], [0, 1]);

    return (
        <motion.div className="flex-1 flex justify-center items-center px-4 sticky top-0 z-0">
            <motion.div
                className="absolute inset-0 bg-black pointer-events-none z-30"
                style={{ opacity: fadeOpacity }}
            />
            <City className="absolute inset-0 z-0" />
            <main
                ref={heroRef}
                className="relative flex flex-col justify-center items-center h-screen w-full rounded-[8px] overflow-hidden mt-9"
            >
                <motion.div
                    className="text-light font-bold text-7xl max-w-5xl text-center flex flex-col justify-center items-center gap-4 z-10"
                    initial="hidden"
                    animate={controls}
                    variants={{
                        hidden: {},
                        visible: { transition: { staggerChildren: 0.3 } },
                    }}
                >
                    <DashboardTicker />
                    <motion.span
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
                        }}
                        className={cn("text-transparent bg-clip-text bg-gradient-to-b from-light via-light to-neutral-800 ")}
                    >
                        From Idea to Deployed
                    </motion.span>

                    <motion.span
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
                        }}
                        className={cn("text-transparent bg-clip-text bg-gradient-to-b from-light via-light to-neutral-800 ")}
                    >
                        Smart Contract
                    </motion.span>

                    <Textarea
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Create a todo application.."
                        className={cn(
                            'h-[8rem] max-w-3xl w-full border-neutral-800 border rounded-[4px] py-4 px-4 shadow-xl z-10 mt-4',
                            'bg-dark-base',
                            'focus-visible:border-neutral-800/50 focus-visible:ring-0 focus:h-[8rem]',
                            'outline-none transition-all duration-200',
                            'text-light tracking-wider resize-none placeholder:text-md',
                        )}
                    />
                </motion.div>

                <div className="absolute bottom-20 left-12 ">
                    <div className="max-w-2xl flex flex-col justify-start items-start text-light font-semibold">
                        <span>Powered by AI + Anchor</span>
                        <span className="">Build Solana Smart Contracts 10x Faster</span>
                        <div className="flex items-end justify-center gap-x-3 mt-2">
                            <Button className="font-semibold !px-6 rounded-[4px]">
                                Explore Playground
                                <RiCodeSSlashFill />
                            </Button>
                            <span className="font-light text-primary tracking-wide text-xs border-b border-primary py-1">
                                Read Our Docs
                            </span>
                        </div>
                    </div>
                </div>
            </main>
        </motion.div>
    );
}
