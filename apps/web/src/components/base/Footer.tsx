import { LiaServicestack } from 'react-icons/lia';
import { FaTwitter, FaGithub, FaDiscord, FaLinkedin } from 'react-icons/fa';
import { motion } from 'framer-motion';
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
        links: [
            { name: 'Twitter', icon: FaTwitter },
            { name: 'GitHub', icon: FaGithub },
            { name: 'Discord', icon: FaDiscord },
            { name: 'LinkedIn', icon: FaLinkedin },
        ],
    },
];

export default function Footer() {
    return (
        <motion.div className="min-w-screen min-h-screen md:h-screen bg-dark-base relative">
            <div className="md:h-[65%] w-full border-b border-neutral-700 md:pt-20 pt-12 px-4 flex flex-col md:flex-row">
                <div className="md:w-[50%] w-full h-full md:border-r border-neutral-700 text-neutral-100 px-4 text-left mb-8 md:mb-0">
                    <div className="max-w-lg md:text-5xl text-3xl font-semibold tracking-wide leading-tight">
                        Build Solana Smart Contracts in Minutes, Not Days.
                    </div>
                    <p className="text-neutral-400 md:text-lg text-base mt-6 max-w-md">
                        AI-powered Anchor contract generation, deployment, and client SDK
                        creation—all in one platform.
                    </p>
                </div>
                <div className="md:w-[50%] w-full h-full flex flex-col md:flex-row">
                    {footerLinks.map((section, index) => (
                        <div
                            key={section.title}
                            className={`w-full h-full px-4 flex flex-col items-start text-neutral-200 gap-y-3 mb-8 md:mb-0 pb-6 md:pb-0 ${index < footerLinks.length - 1 ? 'md:border-r border-b md:border-b-0 border-neutral-700' : ''
                                }`}
                        >
                            <div className="md:text-3xl text-2xl font-semibold">{section.title}</div>
                            <div className="flex flex-col items-start gap-y-2 text-neutral-400">
                                {section.links.map((link) => {
                                    if (typeof link === 'object' && 'icon' in link) {
                                        const Icon = link.icon;
                                        return (
                                            <span
                                                key={link.name}
                                                className="cursor-pointer hover:text-primary transition-colors flex items-center gap-x-2"
                                            >
                                                <Icon className="text-xl size-4" />
                                                {link.name}
                                            </span>
                                        );
                                    }
                                    return (
                                        <span
                                            key={link as string}
                                            className="cursor-pointer hover:text-primary transition-colors"
                                        >
                                            {link as string}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div
                className={`md:h-[35%] py-12 md:py-0 text-neutral-200 w-full flex flex-col justify-center items-center ${bruno.className}`}
            >
                <div className="md:text-9xl text-5xl font-extrabold tracking-wider flex items-center flex-col md:flex-row">
                    <span>WINTERFELL</span>
                    <LiaServicestack className="text-primary md:h-52 md:w-52 h-24 w-24 transition-all duration-500" />
                </div>
                <p className="text-neutral-500 md:text-sm text-xs tracking-wider mt-4 text-center px-4">
                    © 2024 Lovable for Anchor. Powered by AI + Solana.
                </p>
            </div>
        </motion.div>
    );
}