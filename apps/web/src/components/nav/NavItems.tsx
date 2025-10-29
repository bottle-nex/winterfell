'use client';
import { cn } from '@/src/lib/utils';
import { motion } from 'framer-motion';
import { useState } from 'react';

export interface NavItemsType {
    name: string;
    link?: string;
    onClick?: () => void;
}

interface NavItemsProps {
    items: NavItemsType[];
    className?: string;
}

export default function NavItems({ items, className }: NavItemsProps) {
    const [hovered, setHovered] = useState<number | null>(null);
    const [active, setActive] = useState<number | null>(null);

    const handleClick = (idx: number, onClick?: () => void) => {
        if (onClick) {
            onClick();
            setActive(idx);
        }
    };

    return (
        <motion.div
            onMouseLeave={() => setHovered(null)}
            className={cn(
                'hidden items-center justify-center space-x-2 text-sm font-medium tracking-wide text-light transition duration-200 hover:text-[#FDF9F0] lg:flex lg:space-x-2 w-fit bg-[#151617] rounded-[8px] p-[4px] border border-neutral-800',
                className,
            )}
        >
            {items.map((item, idx) => {
                const isActive = active === idx;
                const isHovered = hovered === idx;

                return (
                    <a
                        key={`link-${idx}`}
                        href={item.link}
                        onMouseEnter={() => setHovered(idx)}
                        onClick={() => handleClick(idx, item.onClick)}
                        className="relative px-4 py-2 cursor-pointer select-none"
                    >
                        {(isHovered || isActive) && (
                            <motion.div
                                layoutId="hovered"
                                className="absolute inset-0 h-full w-full rounded-[4px] bg-primary"
                            />
                        )}
                        <span className="relative z-20">{item.name}</span>
                    </a>
                );
            })}
        </motion.div>
    );
}
