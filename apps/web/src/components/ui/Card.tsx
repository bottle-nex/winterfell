'use client';
import { cn } from '@/src/lib/utils';
import React, { ForwardedRef } from 'react';
import { motion } from 'motion/react';
interface UtilityCardProps {
    children: React.ReactNode;
    className?: string;
    ref?: ForwardedRef<HTMLDivElement>;
    onClick?: (e: React.MouseEvent) => void; // Add this
}

export default function Card({ children, className, ref, onClick }: UtilityCardProps) {
    return (
        <motion.div
            onClick={onClick}
            ref={ref}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={cn(
                'border border-neutral-800 shadow-lg rounded-lg px-4 py-2.5',
                'bg-light-base dark:bg-dark-base',
                className,
            )}
        >
            {children}
        </motion.div>
    );
}
