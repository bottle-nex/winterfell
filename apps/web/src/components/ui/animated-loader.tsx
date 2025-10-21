'use client';

import { motion, useAnimation } from 'motion/react';
import { useEffect } from 'react';
import type { Transition, Variants } from 'motion/react';

interface AnimtaedLoaderProps extends React.SVGAttributes<SVGSVGElement> {
    width?: number;
    height?: number;
    strokeWidth?: number;
    stroke?: string;
    shouldAnimate?: boolean;
}

const transition: Transition = {
    duration: 1.5,
    ease: 'easeInOut',
    repeat: Infinity,
    repeatType: 'reverse',
};

const variants: Variants = {
    animate: (custom: number) => ({
        pathLength: [0, 1],
        opacity: [0.2, 1],
        transition: {
            ...transition,
            delay: 0.15 * custom,
        },
    }),
    normal: {
        pathLength: 1,
        opacity: 1,
        transition: { duration: 0.3 },
    },
};

export default function AnimtaedLoader({
    width = 28,
    height = 28,
    strokeWidth = 2,
    stroke = '#ffffff',
    shouldAnimate = true,
    ...props
}: AnimtaedLoaderProps) {
    const controls = useAnimation();

    useEffect(() => {
        if (shouldAnimate) {
            controls.start('animate');
        } else {
            controls.start('normal');
        }
    }, [shouldAnimate, controls]);

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <motion.path
                variants={variants}
                animate={controls}
                custom={0}
                d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
            />
            <motion.polyline
                variants={variants}
                animate={controls}
                custom={1}
                points="7.5 4.21 12 6.81 16.5 4.21"
            />
            <motion.polyline
                variants={variants}
                animate={controls}
                custom={2}
                points="7.5 19.79 7.5 14.6 3 12"
            />
            <motion.polyline
                variants={variants}
                animate={controls}
                custom={3}
                points="21 12 16.5 14.6 16.5 19.79"
            />
            <motion.polyline
                variants={variants}
                animate={controls}
                custom={4}
                points="3.27 6.96 12 12.01 20.73 6.96"
            />
            <motion.line
                variants={variants}
                animate={controls}
                custom={5}
                x1="12"
                x2="12"
                y1="22.08"
                y2="12"
            />
        </svg>
    );
}
