import { LiaServicestack } from 'react-icons/lia';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Ref  } from 'react';
import { Bruno_Ace } from 'next/font/google';

const bruno = Bruno_Ace({
    subsets: ['latin'],
    weight: '400',
    display: 'swap',
});

const footerLinks = [
    {
        title: 'Product',
        links: [
            'AI Contract Generator',
            'Smart Contract Editor',
            'Deploy & Monitor',
            'Client SDK Generator',
            'Template Marketplace',
        ],
    },
    {
        title: 'Resources',
        links: [
            'Documentation',
            'Anchor Guide',
            'API Reference',
            'Security Best Practices',
            'Community Forum',
        ],
    },
    {
        title: 'Connect',
        links: ['Twitter', 'GitHub', 'Discord', 'LinkedIn'],
    },
];

export default function Footer() {
    return (
        <motion.div className="w-screen h-screen bg-dark-base relative">
            <div className='w-full h-[3rem] bg-white'/>

            <div className="h-[65%] w-full border-b border-neutral-700 pt-20 px-4 flex">
                <div className="w-[50%] h-full border-r border-neutral-700 text-neutral-100 px-4">
                    <div className="max-w-lg text-5xl font-semibold tracking-wide leading-tight">
                        Build Solana Smart Contracts in Minutes, Not Days.
                    </div>
                    <p className="text-neutral-400 text-lg mt-6 max-w-md">
                        AI-powered Anchor contract generation, deployment, and client SDK
                        creation—all in one platform.
                    </p>
                </div>
                <div className="w-[50%] h-full flex">
                    {footerLinks.map((section, index) => (
                        <div
                            key={section.title}
                            className={`w-full h-full px-4 flex flex-col items-start  text-neutral-200 gap-y-3 ${
                                index < footerLinks.length - 1 ? 'border-r border-neutral-700' : ''
                            }`}
                        >
                            <div className="text-3xl font-semibold">{section.title}</div>
                            <div className="flex flex-col items-start gap-y-2 text-neutral-400">
                                {section.links.map((link) => (
                                    <span
                                        key={link}
                                        className="cursor-pointer hover:text-primary transition-colors"
                                    >
                                        {link}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div
                className={`h-[35%] text-neutral-200 w-full flex flex-col justify-center items-center ${bruno.className}`}
            >
                <div className="text-[140px] font-extrabold tracking-[0.1em] flex items-center">
                    S H A R K
                    <LiaServicestack className="text-primary h-52 w-52 transition-all duration-500" />
                </div>
                <p className="text-neutral-500 text-sm tracking-wider mt-4">
                    © 2024 Lovable for Anchor. Powered by AI + Solana.
                </p>
            </div>
        </motion.div>
    );
}
