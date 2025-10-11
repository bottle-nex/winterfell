'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function AnimatedCircleText() {
    const texts = ['name it', 'add fields', 'introduce bumps', 'step into the future'];
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % texts.length);
        }, 2500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="absolute left-8 bottom-0 -translate-y-1/2 flex items-center gap-x-4">
            <motion.div
                className="h-3 w-3 rounded-full bg-neutral-200 aspect-square"
                animate={{
                    boxShadow: [
                        '0 0 6px 2px rgba(255,255,255,0.3)',
                        '0 0 12px 4px rgba(255,255,255,0.5)',
                        '0 0 6px 2px rgba(255,255,255,0.3)',
                    ],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />

            <div
                className="relative overflow-hidden h-10 w-36 flex items-center"
                style={{
                    maskImage:
                        'linear-gradient(to bottom, transparent 0%, black 25%, black 75%, transparent 100%)',
                    WebkitMaskImage:
                        'linear-gradient(to bottom, transparent 0%, black 25%, black 75%, transparent 100%)',
                }}
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={texts[index]}
                        initial={{ y: 40, opacity: 0, filter: 'blur(12px)' }}
                        animate={{ y: 0, opacity: 1, filter: 'blur(0px)', color: '#fff' }}
                        exit={{ y: -40, opacity: 0, filter: 'blur(12px)' }}
                        transition={{
                            duration: 1,
                            ease: 'easeInOut',
                        }}
                        className="absolute text-sm font-light tracking-wider select-none"
                    >
                        {texts[index]}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
