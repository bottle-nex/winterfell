'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, useInView, useScroll, useTransform } from 'framer-motion';
import { cn } from '@/src/lib/utils';
import { Button } from '../ui/button';
import { RiCodeSSlashFill } from 'react-icons/ri';
import { Terminal, ArrowRight, FileCode } from 'lucide-react';
import City from './City';
import { Textarea } from '../ui/textarea';
import { BiSolidZap } from 'react-icons/bi';

export default function Hero() {
    const [inputValue, setInputValue] = useState<string>('');
    const [isTyping, setIsTyping] = useState<boolean>(false);
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
                        <h1 className="text-[55px] font-bold leading-tight bg-gradient-to-t from-neutral-700 via-neutral-300 to-neutral-200 bg-clip-text text-transparent">
                            Ship Solana Contracts in Minutes not Months
                            <br />
                            {/* <span className="inline-flex items-center gap-2">
                                <span className="">in</span>
                                <span className="relative inline-block">
                                    <span className="relative z-10">Minutes</span>
                                    <motion.span
                                        className="absolute inset-0"
                                        initial={{ opacity: 0, x: 2, y: 2 }}
                                        animate={{ opacity: [0, 0.3, 0], x: [2, -2, 2], y: [2, -2, 2] }}
                                        transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                                    >
                                        Minutes
                                    </motion.span>
                                </span>
                                <span className="">not</span>

                                <span className="relative inline-block">
                                    Months
                                </span>
                            </span> */}
                        </h1>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7, duration: 0.6 }}
                        className="text-neutral-500 text-sm mb-6 font-normal"
                    >
                        SHARK eats months. Ships in minutes.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9, duration: 0.6 }}
                        className="relative group"
                    >
                        <div className="absolute -inset-1 bg-gradient-to-r from-neutral-600/20 via-neutral-500/20 to-neutral-600/20 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="relative bg-neutral-950 rounded-lg border border-neutral-800 overflow-hidden shadow-2xl">
                            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800/50 bg-neutral-900/50">
                                <div className="flex items-center gap-3">
                                    <div className="flex gap-1.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-neutral-700" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-neutral-700" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-neutral-700" />
                                    </div>
                                    <div className="flex items-center gap-2 text-neutral-500 text-xs font-mono h-full">
                                        <Terminal className="w-3.5 h-3.5" />
                                        <span>shark.ai</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-x-1.5 justify-center">
                                    <div
                                        className={cn(
                                            'w-1.5 h-1.5 rounded-full transition-colors duration-300 mb-0.5',
                                            isTyping
                                                ? 'bg-green-500 shadow-lg shadow-green-500/50'
                                                : 'bg-neutral-700',
                                        )}
                                    />
                                    <span className="text-xs text-neutral-600 font-mono">
                                        {isTyping ? 'active' : 'idle'}
                                    </span>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="absolute left-4 top-5 text-neutral-600 font-mono text-sm select-none">
                                    &gt;
                                </div>
                                <Textarea
                                    value={inputValue}
                                    onChange={(e) => {
                                        setInputValue(e.target.value);
                                        setIsTyping(e.target.value.length > 0);
                                    }}
                                    placeholder="create a counter program..."
                                    className={cn(
                                        'w-full h-28 bg-transparent pl-10 pr-4 py-5 text-neutral-200 border-0',
                                        'placeholder:text-neutral-800 placeholder:font-mono placeholder:text-sm resize-none',
                                        'focus:outline-none transition-all duration-200',
                                        'text-md tracking-wider',
                                        'caret-[#e6e0d4]',
                                    )}
                                    rows={3}
                                />
                            </div>

                            <div className="flex items-center justify-between px-4 py-2.5 border-t border-neutral-800/50 bg-neutral-900/30">
                                <div className="flex items-center gap-3">
                                    <Button className="group/btn bg-transparent hover:bg-transparent flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-300 transition-colors">
                                        <FileCode className="w-3.5 h-3.5 mb-0.5" />
                                        <span className="font-mono">templates</span>
                                    </Button>
                                    <div className="w-px h-3 bg-neutral-800" />
                                    <div className="flex items-center gap-1.5 text-xs text-neutral-600 font-mono">
                                        <span>{inputValue.length}</span>
                                        <span className="text-neutral-800">/</span>
                                        <span className="text-neutral-700">2000</span>
                                    </div>
                                </div>

                                <Button
                                    disabled={!inputValue.trim()}
                                    className={cn(
                                        'group/submit flex items-center gap-2 h-8 w-9 px-2 py-1 rounded-[4px] font-mono text-xs duration-200',
                                        'transition-all duration-200',
                                        inputValue.trim()
                                            ? 'bg-neutral-800 text-neutral-300 hover:text-neutral-200'
                                            : 'bg-neutral-900 text-neutral-700 cursor-not-allowed',
                                    )}
                                >
                                    <ArrowRight
                                        className={cn(
                                            'w-3 h-3 transition-transform',
                                            inputValue.trim() &&
                                                'group-hover/submit:translate-x-0.5 duration-200',
                                        )}
                                    />
                                </Button>
                            </div>
                        </div>

                        <div className="absolute -bottom-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-neutral-600 to-transparent opacity-50" />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.1, duration: 0.6 }}
                        className="flex items-center justify-center gap-4 mt-8"
                    >
                        {[
                            {
                                step: 'Generate',
                                icon: Terminal,
                                delay: 1.2,
                                color: 'text-[#6741EF]',
                            },
                            {
                                step: 'Deploy',
                                icon: BiSolidZap,
                                delay: 1.3,
                                color: 'text-[#FFC412]',
                            },
                            {
                                step: 'Integrate',
                                icon: FileCode,
                                delay: 1.4,
                                color: 'text-[#00A652]',
                            },
                        ].map((item, idx) => (
                            <div key={item.step} className="flex items-center gap-2">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: item.delay, duration: 0.4 }}
                                    className="flex items-center gap-2"
                                >
                                    <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-neutral-900/50 border border-neutral-800/50 backdrop-blur-sm">
                                        <item.icon className={cn('w-3 h-3 mb-0.5', item.color)} />
                                        <span className="text-neutral-500 text-xs font-mono">
                                            {item.step}
                                        </span>
                                    </div>
                                </motion.div>
                                {idx < 2 && <ArrowRight className="w-3 h-3 text-[#9b9b9b]" />}
                            </div>
                        ))}
                    </motion.div>
                </motion.div>

                <div className="absolute bottom-12 left-10">
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
