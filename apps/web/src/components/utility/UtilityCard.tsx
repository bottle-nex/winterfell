'use client';
import { cn } from '@/lib/utils';
import React, { ForwardedRef } from 'react';
import { motion } from 'motion/react';
interface UtilityCardProps {
    children: React.ReactNode;
    className?: string;
    ref?: ForwardedRef<HTMLDivElement>;
}

export default function UtilityCard({ children, className, ref }: UtilityCardProps) {
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={cn(
                'border border-neutral-300 dark:border-neutral-700 shadow-lg rounded-md px-4 py-2.5',
                'bg-light-base dark:bg-dark-base',
                className,
            )}
        >
            {children}
        </motion.div>
    );
}
