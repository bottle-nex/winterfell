'use client';
import { cn } from '@/src/lib/utils';
import React, { ForwardedRef } from 'react';
import { motion } from 'motion/react';
interface UtilityCardProps {
    children: React.ReactNode;
    className?: string;
    ref?: ForwardedRef<HTMLDivElement>;
    onClick?: (e: React.MouseEvent) => void;
}

export default function Card({ children, className, ref, onClick }: UtilityCardProps) {
    return (
        <motion.div
            onClick={onClick}
            ref={ref}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ pointerEvents: 'auto' }}
            className={cn(
                'border border-neutral-800 shadow-lg rounded-lg px-4 py-2.5',
                'bg-light-base dark:bg-dark-base z-80',
                className,
            )}
        >
            {children}
        </motion.div>
    );
}
