import { cn } from '@/src/lib/utils';
import { AnimatePresence, motion, useInView, Variants } from 'framer-motion';
import { useRef } from 'react';

interface ArchitectureTitleComponentProps {
    firstText?: string
    secondText?: string
    bgcolor?: string;
    bordercolor?: string
}

export default function ArchitectureTitleComponent({ 
    firstText = "FIRST", 
    secondText = "SECOND", 
    bgcolor = "bg-[#0a0c0d]", 
    bordercolor = "border-[#6c44fc]" 
}: ArchitectureTitleComponentProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: false, margin: '-100px' });

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
            },
        },
    };

    const letterVariants: Variants = {
        hidden: {
            opacity: 0,
            y: 50,
            rotateX: 90,
        },
        visible: {
            opacity: 1,
            y: 0,
            rotateX: 0,
            transition: {
                duration: 0.3, // Fast duration for each letter
                ease: [0.22, 1, 0.36, 1],
            },
        },
    };

    const renderAnimatedText = (text: string) => {
        return text.split('').map((char, index) => (
            <motion.span
                key={index}
                variants={letterVariants}
                className="inline-block"
                style={{ perspective: '1000px' }}
            >
                {char === ' ' ? '\u00A0' : char}
            </motion.span>
        ));
    };

    return (
        <section
            id="about"
            ref={ref}
            className={cn("w-screen flex flex-col justify-center text-light gap-y-5 z-20", bgcolor)}
        >
            <AnimatePresence>
                <motion.div
                    className="h-[90%] px-8 mt-8"
                    initial="hidden"
                    animate={isInView ? 'visible' : 'hidden'}
                >
                    <motion.div 
                        className={cn("w-full flex items-center justify-start border-t-2 overflow-hidden", bordercolor)}
                        variants={containerVariants}
                    >
                        <span className="text-3xl md:text-[7rem] font-semibold tracking-widest">
                            {renderAnimatedText(firstText)}
                        </span>
                    </motion.div>
                    <motion.div 
                        className={cn("w-full flex items-center justify-start border-b-2 border-t-2 overflow-hidden", bordercolor)}
                        variants={containerVariants}
                    >
                        <span className="text-3xl md:text-[7rem] ml-12 md:ml-[24rem] font-semibold tracking-widest">
                            {renderAnimatedText(secondText)}
                        </span>
                    </motion.div>
                </motion.div>
            </AnimatePresence>
        </section>
    );
}