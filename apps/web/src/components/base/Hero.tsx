'use client';
import { useEffect, useRef } from 'react';
import { motion, useAnimation, useInView, useScroll, useTransform } from 'framer-motion';
import { Button } from '../ui/button';
import { RiCodeSSlashFill } from 'react-icons/ri';
import City from './City';
import ActionTickers from '../tickers/ActionTickers';
import DashboardTextAreaComponent from './DashboardTextAreaComponent';
import HighlighterTicker from '../tickers/HighlighterTicker';
import { useRouter } from 'next/navigation';

export default function Hero() {
    const heroRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(heroRef, { once: true });
    const controls = useAnimation();
    const router = useRouter();

    useEffect(() => {
        if (isInView) {
            controls.start('visible');
        }
    }, [isInView, controls]);

    const { scrollY } = useScroll();
    const fadeOpacity = useTransform(scrollY, [0, 800], [0, 1]);

    return (
        <motion.div className="flex-1 flex justify-center items-center px-4 sticky top-0 md:top-0 z-0">
            <motion.div
                className="absolute inset-0 bg-black pointer-events-none z-30"
                style={{ opacity: fadeOpacity }}
            />
            <City className="absolute inset-0 z-0" />

            <main
                ref={heroRef}
                className="relative flex flex-col justify-center items-center h-screen w-full overflow-hidden"
            >
                <motion.div
                    className="relative z-10 w-full max-w-2xl"
                    initial="hidden"
                    animate={controls}
                    variants={{
                        hidden: { opacity: 0 },
                        visible: { opacity: 1, transition: { duration: 0.8 } },
                    }}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                        className="mb-3"
                    >
                        <h1 className="text-[28px] md:text-[60px] font-bold leading-tight bg-gradient-to-t flex flex-col from-neutral-700 via-neutral-300 to-neutral-200 bg-clip-text text-transparent">
                            <span>Ship Solana Contracts</span>
                            <span>in Minutes not Months</span>
                        </h1>
                    </motion.div>

                    <HighlighterTicker />
                    <DashboardTextAreaComponent />
                    <ActionTickers />
                </motion.div>

                <div className="absolute bottom-2 left-0 md:bottom-12 md:left-10 text-[10px] md:text-[18px]">
                    <div className="md:max-w-2xl max-w-sm flex flex-col justify-start items-start text-light font-semibold">
                        <span>Powered by AI + Anchor</span>
                        <span className="">Build Solana Smart Contracts 10x Faster</span>
                        <div className="flex items-end justify-center gap-x-2 md:gap-x-3 mt-2">
                            <Button className="font-semibold text-xs md:text-base !px-4 md:!px-6 rounded-[4px]">
                                Explore Playground
                                <RiCodeSSlashFill />
                            </Button>
                            <span onClick={() => router.push("/docs/client")} className="font-light text-primary tracking-wide md:text-xs border-b border-primary py-1 cursor-pointer">
                                Read Our Docs
                            </span>
                        </div>
                    </div>
                </div>
            </main>
        </motion.div>
    );
}
