import React from 'react';
import { RiShieldFill, RiFlightLandFill, RiCodeSSlashFill, RiTerminalBoxFill, RiBox3Fill, RiRocketFill } from 'react-icons/ri';
import { IconType } from 'react-icons';

interface Feature {
    id: string;
    title: string;
    description: string;
    icon: IconType;
    accent: string;
    span: string;
    delay: number;
}

interface BentoCardProps {
    feature: Feature;
    index: number;
}

const features: Feature[] = [
    {
        id: 'secure',
        title: 'Isolated Execution',
        description: 'Each workspace runs in its own container. Your contracts are compiled and tested in a secure environment with zero interference.',
        icon: RiShieldFill,
        accent: '#6c44fc',
        span: 'col-span-2 row-span-2',
        delay: 0.1
    },
    {
        id: 'instant',
        title: 'Real-time Builds',
        description: 'Watch your Rust code compile as you type. No waiting, no context switching.',
        icon: RiFlightLandFill,
        accent: '#9679ffea',
        span: 'col-span-2 row-span-1',
        delay: 0.2
    },
    {
        id: 'anchor',
        title: 'Native Anchor',
        description: 'Full Anchor framework support out of the box. All dependencies, all tools, zero configuration.',
        icon: RiCodeSSlashFill,
        accent: '#1c1d20',
        span: 'col-span-2 row-span-1',
        delay: 0.3
    },
    {
        id: 'terminal',
        title: 'Built-in Terminal',
        description: 'Run commands, check logs, debug—everything you need without leaving the browser.',
        icon: RiTerminalBoxFill,
        accent: '#6c44fc',
        span: 'col-span-1 row-span-1',
        delay: 0.4
    },
    {
        id: 'deps',
        title: 'Pre-loaded',
        description: 'Cargo, rustc, Anchor CLI—all ready when you are.',
        icon: RiBox3Fill,
        accent: '#9679ffea',
        span: 'col-span-1 row-span-1',
        delay: 0.5
    },
    {
        id: 'deploy',
        title: 'Ship Fast',
        description: 'From code to chain in minutes. Deploy to any Solana network with confidence.',
        icon: RiRocketFill,
        accent: '#6c44fc',
        span: 'col-span-2 row-span-1',
        delay: 0.6
    }
];

function BentoCard({ feature, index }: BentoCardProps) {
    const Icon = feature.icon;
    const isLarge = feature.span.includes('row-span-2');
    const isDark = feature.accent === '#1c1d20';

    return (
        <div className={`${feature.span} group`}>
            <div
                className="h-full rounded-[4px] p-6 transition-all duration-300 hover:scale-[1.02] cursor-pointer relative overflow-hidden"
                style={{
                    backgroundColor: isDark ? feature.accent : '#fdf9f0',
                    border: isDark ? 'none' : '1px solid rgba(108, 68, 252, 0.1)'
                }}
            >
                <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                        background: `radial-gradient(circle at top right, ${feature.accent}15, transparent 70%)`
                    }}
                />

                <div className="relative z-10 h-full flex flex-col">
                    <div
                        className="w-12 h-12 rounded-[4px] flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 shrink-0"
                        style={{
                            backgroundColor: isDark ? 'rgba(150, 121, 255, 0.15)' : 'rgba(108, 68, 252, 0.08)'
                        }}
                    >
                        <Icon
                            size={24}
                            style={{ color: isDark ? '#9679ffea' : feature.accent }}
                        />
                    </div>

                    <div className="flex-1 text-left">
                        <h3
                            className={`font-semibold mb-2 ${isLarge ? 'text-2xl' : 'text-lg'}`}
                            style={{ color: isDark ? '#fdf9f0' : '#1c1d20' }}
                        >
                            {feature.title}
                        </h3>
                        <p
                            className={`leading-relaxed ${isLarge ? 'text-[15px]' : 'text-[14px]'}`}
                            style={{
                                color: isDark ? 'rgba(253, 249, 240, 0.75)' : '#141517',
                                opacity: isDark ? 1 : 0.8
                            }}
                        >
                            {feature.description}
                        </p>
                    </div>

                    {isLarge && (
                        <div className="mt-4 flex items-center gap-2 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{ color: isDark ? '#9679ffea' : feature.accent }}
                        >
                            <span>Explore</span>
                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function ClientE2BBento() {
    return (
        <div className="w-full rounded-[4px]">
            <div className="mb-4 text-left bg-primary p-6 rounded-[4px]">
                <h2
                    className="text-5xl font-bold mb-4 tracking-tight"
                >
                    Winterfell Runtime
                </h2>
                <p
                    className="text-lg max-w-2xl"
                >
                    A sandboxed development environment built for Anchor smart contracts.
                    Write, compile, test, and deploy—all in one place.
                </p>
            </div>

            <div className="grid grid-cols-4 gap-4 auto-rows-[180px]">
                {features.map((feature, index) => (
                    <BentoCard key={feature.id} feature={feature} index={index} />
                ))}
            </div>
        </div>
    );
}