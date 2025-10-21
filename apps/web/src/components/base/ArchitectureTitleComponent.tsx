import { AnimatePresence, motion, useInView, Variants } from 'framer-motion';
import { useRef } from 'react';

export default function ArchitectureTitleComponent() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3,
                delayChildren: 0.2,
            },
        },
    };

    const textVariants: Variants = {
        hidden: {
            opacity: 0,
            y: 100,
            rotateX: 90,
        },
        visible: {
            opacity: 1,
            y: 0,
            rotateX: 0,
            transition: {
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
            },
        },
    };

    return (
        <div
            ref={ref}
            className="md:h-[60vh] w-screen flex flex-col justify-center text-light gap-y-5 bg-[#0a0c0d] z-20"
        >
            <AnimatePresence>
                <motion.div
                    className="h-[90%] px-8 mt-8"
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? 'visible' : 'hidden'}
                >
                    <div className="w-full flex items-center justify-start border-b border-t border-primary overflow-hidden">
                        <motion.span
                            variants={textVariants}
                            className="text-3xl md:text-[7rem] font-semibold tracking-widest"
                        >
                            WINTERFELL&apos;s
                        </motion.span>
                    </div>
                    <div className="w-full flex items-center justify-start border-b border-t border-primary overflow-hidden">
                        <motion.span
                            variants={textVariants}
                            className="text-3xl md:text-[7rem] ml-12 md:ml-[24rem] font-semibold tracking-widest"
                        >
                            ARCHITECTURE
                        </motion.span>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
