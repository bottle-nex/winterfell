'use client';

import { useEffect } from 'react';
import type { Transition } from 'motion/react';
import { motion, useAnimation } from 'motion/react';

interface CircleDotDashedProps extends React.SVGAttributes<SVGSVGElement> {
    width?: number;
    height?: number;
    strokeWidth?: number;
    stroke?: string;
    shouldAnimate?: boolean;
}

const transition: Transition = {
    duration: 2,
    ease: 'linear',
};

export const CircleDotDashed = ({
    width = 28,
    height = 28,
    strokeWidth = 2,
    stroke = '#ffffff',
    shouldAnimate = false,
    ...props
}: CircleDotDashedProps) => {
    const controls = useAnimation();

    useEffect(() => {
        let isActive = true;

        const loop = async () => {
            while (isActive && shouldAnimate) {
                await controls.start({
                    rotate: 360,
                    transition,
                });
                await controls.start({
                    rotate: 0,
                    transition: { duration: 0 },
                });
            }
        };

        if (shouldAnimate) {
            loop();
        } else {
            controls.start({ rotate: 0 });
        }

        return () => {
            isActive = false;
        };
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
                <motion.g animate={controls} initial={{ rotate: 0 }}>
                    <path d="M10.1 2.18a9.93 9.93 0 0 1 3.8 0" />
                    <path d="M17.6 3.71a9.95 9.95 0 0 1 2.69 2.7" />
                    <path d="M21.82 10.1a9.93 9.93 0 0 1 0 3.8" />
                    <path d="M20.29 17.6a9.95 9.95 0 0 1-2.7 2.69" />
                    <path d="M13.9 21.82a9.94 9.94 0 0 1-3.8 0" />
                    <path d="M6.4 20.29a9.95 9.95 0 0 1-2.69-2.7" />
                    <path d="M2.18 13.9a9.93 9.93 0 0 1 0-3.8" />
                    <path d="M3.71 6.4a9.95 9.95 0 0 1 2.7-2.69" />
                </motion.g>
            </svg>
        </div>
    );
};
