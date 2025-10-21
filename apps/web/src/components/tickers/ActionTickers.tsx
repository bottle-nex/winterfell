import { cn } from '@/src/lib/utils';
import { ArrowRight, FileCode, Terminal } from 'lucide-react';
import { BiSolidZap } from 'react-icons/bi';
import { motion } from 'framer-motion';

export default function ActionTickers() {
    return (
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
                    color: 'text-[#d41b1b]',
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
                            <span className="text-neutral-500 text-xs font-mono">{item.step}</span>
                        </div>
                    </motion.div>
                    {idx < 2 && <ArrowRight className="w-3 h-3 text-[#9b9b9b]" />}
                </div>
            ))}
        </motion.div>
    );
}
