import { motion } from 'framer-motion';
import { Highlighter } from '@/components/ui/highlighter';

export default function HighlighterTicker() {
    return (
        <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="text-[#a7a7a7] text-sm mb-6 font-mono tracking-wider"
        >
            Winterfell eats{' '}
            <span className="text-white">
                <Highlighter action="highlight" padding={5} iterations={1} color="#6741EF">
                    months
                </Highlighter>
            </span>
            . Ships in{' '}
            <Highlighter action="underline" padding={0} color="#FFC412">
                minutes
            </Highlighter>
        </motion.p>
    );
}
