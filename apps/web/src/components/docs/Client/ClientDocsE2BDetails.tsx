import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Cpu, Rocket, Shield } from 'lucide-react';
import { Button } from '../../ui/button';

const tabs = [
    {
        id: 'overview',
        label: 'Overview',
        icon: Box,
        content: {
            title: 'Winterfell Sandbox',
            description:
                'Our E2B-powered sandbox environment provides a secure, isolated space for building and testing Anchor smart contracts. No local setup required—just write, compile, and deploy directly from your browser.',
        },
    },
    {
        id: 'features',
        label: 'Features',
        icon: Cpu,
        content: {
            title: 'Powered by E2B',
            description:
                'Leverage cloud-based execution with full Rust and Anchor framework support. Each session runs in a dedicated container with pre-configured dependencies, ensuring consistent builds and eliminating environment conflicts.',
        },
    },
    {
        id: 'security',
        label: 'Security',
        icon: Shield,
        content: {
            title: 'Enterprise-Grade Security',
            description:
                'Every sandbox instance is completely isolated with network restrictions and resource limits. Your code runs in a secure environment that prevents unauthorized access and ensures safe testing before mainnet deployment.',
        },
    },
    {
        id: 'deploy',
        label: 'Deploy',
        icon: Rocket,
        content: {
            title: 'One-Click Deployment',
            description:
                'Seamlessly transition from development to deployment. Test on devnet, validate on testnet, and deploy to mainnet—all from the same interface. Winterfell handles the complexity so you can focus on building.',
        },
    },
];

export default function ClientDocsE2BDetails() {
    const [activeTab, setActiveTab] = useState('overview');

    const currentTab = tabs.find((tab) => tab.id === activeTab);

    return (
        <div className="w-full mt-12">
            <div className="overflow-hidden">
                <div className="flex backdrop-blur-sm">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <Button
                                variant={'ghost'}
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 px-6 py-4 flex items-center justify-center gap-2 transition-all duration-300 relative hover:bg-dark-base hover:text-light ${
                                    activeTab === tab.id ? 'text-primary' : 'text-light'
                                }`}
                            >
                                <Icon className="w-4 h-4" />
                                <span className="font-medium text-sm">{tab.label}</span>
                                {activeTab === tab.id && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                    />
                                )}
                            </Button>
                        );
                    })}
                </div>

                <div className="min-h-[180px] mt-4">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-3 text-left bg-dark rounded-[4px] px-8 py-6"
                        >
                            <h3 className="text-2xl font-bold text-light">
                                {currentTab?.content.title}
                            </h3>
                            <p className="text-light/60 leading-relaxed text-[15px]">
                                {currentTab?.content.description}
                            </p>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
