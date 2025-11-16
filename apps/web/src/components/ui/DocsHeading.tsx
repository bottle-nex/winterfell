import { cn } from '@/src/lib/utils';
import { doto } from '../base/FeatureOne';
import { motion } from 'framer-motion';

interface DocsHeadingProps {
    firstText?: string;
    secondText?: string;
}

export default function DocsHeading({ firstText, secondText }: DocsHeadingProps) {
    return (
        <div className={cn('flex items-center gap-x-3 text-6xl', doto.className)}>
            <motion.div
                initial={{ y: -40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="font-bold"
            >
                {firstText}
            </motion.div>
            <motion.i
                transition={{ duration: 0.6 }}
                initial={{ x: 40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="font-normal text-primary"
            >
                {secondText}
            </motion.i>
        </div>
    );
}
