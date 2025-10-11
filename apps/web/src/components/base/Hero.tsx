'use client';
import { useState, useEffect } from 'react';
import { ArrowRightIcon } from 'lucide-react';
import { motion, useAnimation, useInView, useMotionValue, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { GoArrowUpRight } from 'react-icons/go';
import { Textarea } from '../ui/textarea';
import { cn } from '@/src/lib/utils';
import { AnimatedShinyText } from '@/components/ui/animated-shiny-text';

export default function Hero() {
    const [showText, setShowText] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState<string>('');

    const heroRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(heroRef, { once: true });
    const controls = useAnimation();

    useEffect(() => {
        if (isInView) controls.start('visible');
    }, [isInView, controls]);

    const y = useMotionValue(0);
    useEffect(() => {
        const handleScroll = () => {
            y.set(window.scrollY * 0.3);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [y]);

    const yTransform = useTransform(y, [0, 500], [0, -100]);

    return (
        <div className="flex-1 flex justify-center items-center px-4 sticky top-0">
            <div className="absolute top-2 left-5 text-[#C3C3C3] text-[17px] tracking-[0.5rem] cursor-pointer z-20 select-none">
                STAIR
            </div>

            <div className="absolute top-2 right-5 text-[#8A8784] text-[17px] tracking-wider hover:tracking-widest flex items-center gap-x-1 cursor-pointer group z-20 select-none">
                DOCS
                <GoArrowUpRight
                    className="group-hover:brightness-150 transition-all duration-300 h-5 w-5"
                    strokeWidth={1}
                />
            </div>
            <main
                ref={heroRef}
                className="relative flex flex-col justify-center items-center h-screen w-full bg-dark-base rounded-[8px] overflow-hidden mt-9"
            >
                {/* <CircularDotsCanvas /> */}
                <motion.div
                    style={{ y: yTransform }}
                    className="absolute h-[900px] w-[900px] rounded-full -top-80 -right-40 flex justify-center items-center bg-gradient-to-r from-dark-base to-dark"
                >
                    <div className="h-[700px] w-[700px] rounded-full bg-gradient-to-br from-dark to-dark-base opacity-50" />
                </motion.div>

                <motion.div
                    className="text-light font-bold text-7xl max-w-5xl text-center flex flex-col justify-center items-center gap-4 z-10"
                    initial="hidden"
                    animate={controls}
                    variants={{
                        hidden: {},
                        visible: { transition: { staggerChildren: 0.3 } },
                    }}
                >
                    <motion.span
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
                        }}
                    >
                        From Idea to Deployed
                    </motion.span>

                    <motion.span
                        className="shadow-inset-center bg-primary text-dark max-w-[40rem] overflow-hidden flex items-center justify-center font-bold"
                        style={{ height: '6rem' }}
                        variants={{
                            hidden: { width: '0%' },
                            visible: {
                                width: '100%',
                                transition: { duration: 0.6, ease: 'easeInOut' },
                            },
                        }}
                        onAnimationComplete={() => setShowText(true)}
                    >
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: showText ? 1 : 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            Solana Contract
                        </motion.span>
                    </motion.span>
                    <div className="z-10 flex items-center justify-center">
                        <div
                            className={cn(
                                'group rounded-[4px] border border-neutral-800 bg-dark text-base text-light transition-all ease-in hover:cursor-pointer hover:bg-dark-base/90',
                            )}
                        >
                            <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
                                <span className="tracking-wide text-light/60 font-normal text-sm">
                                    ✨ powered by ai
                                </span>
                                <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
                            </AnimatedShinyText>
                        </div>
                    </div>
                    <Textarea
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Create a todo application.."
                        className={cn(
                            'h-[8rem] max-w-3xl w-full border-neutral-800 border rounded-[4px] py-4 px-4 shadow-xl z-10',
                            'bg-dark',
                            'focus-visible:border-neutral-800/50 focus-visible:ring-0 focus:h-[8rem]',
                            'outline-none transition-all duration-200',
                            'text-light tracking-wider resize-none placeholder:text-md',
                        )}
                    />
                </motion.div>
            </main>
        </div>
    );
}
