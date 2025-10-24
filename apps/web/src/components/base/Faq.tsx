'use client';
import { cn } from '@/src/lib/utils';
import { useState, useRef, memo } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { doto } from './FeatureOne';
import { motion, useInView } from 'framer-motion';

/* eslint-disable react/prop-types */

interface FaqData {
    question: string;
    answer: string;
}

interface FaqItemProps {
    faq: FaqData;
    index: number;
    isOpen: boolean;
    onToggle: () => void;
}

// Separate FAQ Item Component
const FaqItem = memo<FaqItemProps>(({ faq, index, isOpen, onToggle }) => {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="overflow-hidden transition-all duration-300 border-b border-neutral-300"
        >
            <div
                onClick={onToggle}
                className="w-full py-5 flex items-center justify-between text-left transition-colors duration-200 cursor-pointer hover:opacity-80"
            >
                <span className="text-lg font-semibold text-[#141517] pr-4 hover:text-[#14151795] transition-colors">
                    {faq.question}
                </span>
                <AiOutlinePlus
                    className={`w-6 h-6 text-primary flex-shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-45' : ''
                    }`}
                />
            </div>
            <div
                className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? 'max-h-96' : 'max-h-0'
                }`}
            >
                <div className="pb-6 pt-1">
                    <p className="text-dark-base/70 leading-relaxed text-left">
                        {faq.answer}
                    </p>
                </div>
            </div>
        </motion.div>
    );
});

FaqItem.displayName = 'FaqItem';

export default function Faq() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const faqs: FaqData[] = [
        {
            question: "What is Lovable for Anchor?",
            answer: "Lovable for Anchor is an AI-powered platform for building, editing, deploying, and interacting with Rust-based smart contracts on Solana using Anchor. It simplifies the entire smart contract workflow from generation to frontend integration."
        },
        {
            question: "Do I need to know Rust to use this platform?",
            answer: "No! Our AI can generate Anchor contracts from natural language descriptions. However, understanding Rust and Solana concepts will help you customize and optimize your contracts more effectively."
        },
        {
            question: "What types of contracts can I build?",
            answer: "You can build various Solana programs including token contracts, NFT contracts, DeFi programs, escrow systems, and payment programs. We provide templates for common use cases and support custom contract generation."
        },
        {
            question: "Can I deploy to mainnet?",
            answer: "Yes! Lovable for Anchor supports one-click deployment to Solana Devnet, Testnet, and Mainnet. We also provide CLI commands and track deployed program IDs for easy management."
        },
        {
            question: "Does it generate client code for my contract?",
            answer: "Absolutely! The platform automatically generates TypeScript/JavaScript client SDKs with typed functions for each instruction, wallet integration, and helper functions for PDAs and transactions."
        },
        {
            question: "What about security?",
            answer: "Our AI assistant warns about known vulnerabilities like unchecked seeds and missing payer checks. We also provide an AI-powered security checklist covering seeds, admin restrictions, and rent exemption checks."
        },
        {
            question: "How do I test my contracts?",
            answer: "The platform auto-generates Anchor test scripts and allows you to simulate transactions in-browser or on devnet before deployment. You can also test frontend integrations with our interactive sandbox."
        }
    ];

    const toggleFaq = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#fdf9f0] to-[#e5e5e5] px-6 md:px-12 lg:px-20 py-16 lg:py-20 z-10">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    <div className="flex flex-col items-start justify-center gap-8 lg:gap-12">
                        <h1
                            className={cn(
                                "text-6xl lg:text-9xl font-black text-dark-base leading-tight text-left",
                                doto.className
                            )}
                        >
                            FAQs
                        </h1>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <FaqItem
                                key={index}
                                faq={faq}
                                index={index}
                                isOpen={openIndex === index}
                                onToggle={() => toggleFaq(index)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}