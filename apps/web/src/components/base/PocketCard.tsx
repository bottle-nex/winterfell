import { motion } from 'motion/react';
import Navbar from '../nav/Navbar';

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
        </motion.div>
    );
}
