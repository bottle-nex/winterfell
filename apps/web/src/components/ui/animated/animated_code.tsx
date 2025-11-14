'use client';

import type { Transition } from 'motion/react';
import { motion, useAnimation } from 'motion/react';

interface CodeProps extends React.SVGAttributes<SVGSVGElement> {
    width?: number;
    height?: number;
    strokeWidth?: number;
    stroke?: string;
}

const defaultTransition: Transition = {
    type: 'spring',
    stiffness: 250,
    damping: 25,
};

const Code = ({
    width = 28,
    height = 28,
    strokeWidth = 2,
    stroke = '#ffffff',
    ...props
}: CodeProps) => {
    const controls = useAnimation();

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
            onMouseEnter={() => controls.start('animate')}
            onMouseLeave={() => controls.start('normal')}
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
                <motion.polyline
                    variants={{
                        normal: { translateX: '0%' },
                        animate: { translateX: '-2px' },
                    }}
                    transition={defaultTransition}
                    animate={controls}
                    initial="normal"
                    points="8 6 2 12 8 18"
                />
                <motion.polyline
                    variants={{
                        normal: { translateX: '0%' },
                        animate: { translateX: '2px' },
                    }}
                    transition={defaultTransition}
                    animate={controls}
                    initial="normal"
                    points="16 18 22 12 16 6"
                />
            </svg>
        </div>
    );
};

export { Code };
