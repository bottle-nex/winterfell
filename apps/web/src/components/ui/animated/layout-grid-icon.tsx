'use client';
import { useEffect } from 'react';
import { motion, useAnimation } from 'motion/react';
import type { Variants } from 'motion/react';

// Define the positions outside for reusability
const getPosition = (i: number) => {
    const positions = [
        { x: 11, y: 0 }, // top-left
        { x: 0, y: 11 }, // top-right
        { x: -11, y: 0 }, // bottom-right
        { x: 0, y: -11 }, // bottom-left
    ];
    return positions[i];
};

const boxVariants: Variants = {
    normal: {
        x: 0,
        y: 0,
    },
    animate: (i: number) => getPosition(i),
};

interface LayoutGridProps extends React.SVGAttributes<SVGSVGElement> {
    width?: number;
    height?: number;
    strokeWidth?: number;
    stroke?: string;
    shouldAnimate?: boolean;
}

const LayoutGrid = ({
    width = 28,
    height = 28,
    strokeWidth = 2,
    stroke = '#e4e4e4',
    shouldAnimate = false,
    ...props
}: LayoutGridProps) => {
    const controls = useAnimation();

    useEffect(() => {
        if (shouldAnimate) {
            controls.start((i) => ({
                ...getPosition(i as number),
                transition: {
                    repeat: Infinity,
                    repeatType: 'loop' as const,
                    duration: 0.5,
                    ease: 'easeInOut',
                },
            }));
        } else {
            controls.start('normal');
        }
    }, [shouldAnimate, controls]);

    return (
        <div
            style={{
                cursor: 'pointer',
                userSelect: 'none',
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
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
                {[0, 1, 2, 3].map((i) => (
                    <motion.rect
                        key={i}
                        width="7"
                        height="7"
                        x={i === 1 || i === 2 ? 14 : 3}
                        y={i >= 2 ? 14 : 3}
                        rx="1"
                        custom={i}
                        variants={boxVariants}
                        animate={controls}
                        initial="normal"
                    />
                ))}
            </svg>
        </div>
    );
};

export { LayoutGrid };
