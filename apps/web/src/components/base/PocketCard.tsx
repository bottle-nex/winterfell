import { motion } from 'motion/react';
import Navbar from '../nav/Navbar';
import Hero from './Hero';
import { Button } from '../ui/button';
import { ChevronRight } from 'lucide-react';
import AnimatedCircleText from './AnimatedCircleText';

export default function PocketCard() {
    return (
        <motion.div
            initial={{
                opacity: 0,
                y: 100,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            transition={{
                ease: [0.25, 0.46, 0.45, 0.94],
                duration: 0.5,
                y: { type: 'spring', stiffness: 300, damping: 30 },
            }}
            className="h-full w-full rounded-t-[8px] bg-dark-base relative overflow-hidden py-4 px-3"
        >
            <Navbar />
            <div className="flex h-full w-full relative">
                <div className="w-[80%] h-full flex justify-start items-center font-extrabold text-[#FDF9EF] text-7xl pb-20 z-10">
                    <Hero />
                </div>
            </div>

            <div className="absolute bottom-4 right-4 font-extrabold text-[#FDF9EF] text-[80px] tracking-wide flex justify-center items-center z-10">
                <Button className="flex items-center bg-light text-dark-base hover:bg-[#FDF9EF] transition-colors duration-300 group">
                    Redefine smart contracts
                    <span className="ml-1 transition-transform duration-300 group-hover:translate-x-1">
                        <ChevronRight />
                    </span>
                </Button>
            </div>

            <AnimatedCircleText />
        </motion.div>
    );
}
