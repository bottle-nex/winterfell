'use client';
import React from 'react';
import { motion, MotionValue, useScroll, useTransform } from 'framer-motion';
import { LiaServicestack } from 'react-icons/lia';
import { FaBolt, FaShieldAlt } from 'react-icons/fa';
import { FaRust } from 'react-icons/fa6';
import { Highlighter } from '@/components/ui/highlighter';
import { TbAnchor } from 'react-icons/tb';

const featureData = [
    {
        topTitle: 'WINTERFELL POWER',
        centerTitle: 'Smart Contracts',
        bottomTitle: 'Build with ease',
        icon: FaRust,
        color: '#CE422B',
    },
    {
        topTitle: 'LIGHTNING FAST',
        centerTitle: 'Deploy Instantly',
        bottomTitle: 'No delays, just code',
        icon: FaBolt,
        color: '#FFC400',
    },
    {
        topTitle: 'ENHANCED EXPERIENCE',
        centerTitle: 'WINTERFELL',
        bottomTitle: 'Fins dont wait',
        icon: LiaServicestack,
        color: '#6C44FC',
    },
    {
        topTitle: 'FUN CODING',
        centerTitle: 'Anchor',
        bottomTitle: 'Enjoy creating',
        icon: TbAnchor,
        color: '#106DE1',
    },
    {
        topTitle: 'ROCK-SOLID',
        centerTitle: 'Security',
        bottomTitle: 'Safe & reliable',
        icon: FaShieldAlt,
        color: '#00C6A7',
    },
];

export default function Features() {
    const containerRef = React.useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end'],
    });

    return (
        <div ref={containerRef} className="relative bg-dark-base" style={{ height: '350vh' }}>
            <div className="sticky top-0 w-screen h-screen flex flex-col items-center justify-start pt-26 px-10 gap-x-16 bg-primary z-10 overflow-hidden rounded-[4px]">
                <div className="w-full max-w-[60%] text-5xl font-bold tracking-wider text-[#FDF9F0] leading-[1.2] relative">
                    BECAUSE CODING SHOULDN&apos;T RUIN YOUR SLEEP SCHEDULE
                    <div className="absolute text-[15px] -top-8 font-extralight w-full flex justify-center text-[#d6caae]">
                        fin-tastic features. zero-hassle.
                    </div>
                </div>

                <motion.div
                    className="mt-26 flex flex-col w-full space-y-3 pointer-events-none"
                    style={{ opacity: useTransform(scrollYProgress, [0, 0.2], [0, 1]) }}
                >
                    <div className="mt-10 w-full flex justify-center text-2xl tracking-widest text-dark-base font-semibold">
                        Transform your blockchain ideas into&nbsp;
                        <Highlighter action="underline" color="#6C44FC">
                            production-ready
                        </Highlighter>
                        &nbsp;contracts seamlessly.
                    </div>
                </motion.div>

                <div className="relative w-full flex justify-center items-center mt-20 space-x-2 h-[2rem] bg-primary">
                    {featureData.map((feature, index) => (
                        <AnimatedFeatureCard
                            key={index}
                            index={index}
                            scrollProgress={scrollYProgress}
                            {...feature}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

interface FeatureCardProps {
    topTitle: string;
    centerTitle: string;
    bottomTitle: string;
    icon: React.ElementType;
    color: string;
    index: number;
    //@typescript-eslint/no-explicit-any
    scrollProgress: MotionValue<number>;
}

export function AnimatedFeatureCard({
    topTitle,
    centerTitle,
    bottomTitle,
    icon: Icon,
    color,
    index,
    scrollProgress,
}: FeatureCardProps) {
    const totalCards = 4;
    const delayFactor = index / totalCards;

    const startAnimation = 0.2 + delayFactor * 0.2;
    const holdStart = 0.45 + delayFactor * 0.2;
    const holdEnd = 0.7 + delayFactor * 0.2;
    const vanishStart = 0.75 + delayFactor * 0.2;
    const vanishEnd = 0.95 + delayFactor * 0.2;

    const timeline = [startAnimation, holdStart, holdEnd, vanishStart, Math.min(vanishEnd, 1)];

    const randomRotate = React.useMemo(() => Math.random() * 20 - 10, []);
    const randomX = React.useMemo(() => Math.random() * 50 - 25, []);

    const y = useTransform(scrollProgress, timeline, [200, 0, 0, -30, -180]);
    const opacity = useTransform(scrollProgress, timeline, [0, 1, 1, 1, 0]);
    const rotate = useTransform(scrollProgress, [timeline[0], timeline[1]], [0, randomRotate]);
    const x = useTransform(scrollProgress, [timeline[0], timeline[1]], [0, randomX]);

    return (
        <motion.div
            style={{ y, opacity, rotate, x }}
            className="h-[20rem] w-[15rem] rounded-xl flex flex-col justify-center items-center 
             bg-light border-2 border-neutral-800 backdrop-blur-xs shadow-lg shadow-black/20 relative p-4"
        >
            <div className="absolute top-2 right-3 text-sm text-dark-base tracking-wider">
                {topTitle}
            </div>

            <div className="flex flex-col items-center gap-y-3 text-md text-dark-base">
                <Icon className="text-4xl" style={{ color }} />
                <span className="tracking-wide">{centerTitle}</span>
            </div>

            <div className="absolute bottom-2 left-3 text-sm text-dark-base tracking-wider">
                {bottomTitle}
            </div>
        </motion.div>
    );
}
