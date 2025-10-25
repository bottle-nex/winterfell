'use client';
import { cn } from '@/src/lib/utils';
import { useState, useRef, memo } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { doto } from './FeatureOne';
import { motion, useInView } from 'framer-motion';
import { Button } from '../ui/button';
import { FaGithub } from 'react-icons/fa';

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

const FaqItem = memo<FaqItemProps>(({ faq, index, isOpen, onToggle }) => {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-50px' });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={cn(
                'overflow-hidden transition-all duration-300',
                index <= 5 ? 'border-b border-neutral-300' : '',
            )}
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
                    <p className="text-dark-base/70 leading-relaxed text-left">{faq.answer}</p>
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
            question: 'What is Lovable for Anchor?',
            answer: 'Lovable for Anchor is an AI-powered platform for building, editing, deploying, and interacting with Rust-based smart contracts on Solana using Anchor. It simplifies the entire smart contract workflow from generation to frontend integration.',
        },
        {
            question: 'Do I need to know Rust to use this platform?',
            answer: 'No! Our AI can generate Anchor contracts from natural language descriptions. However, understanding Rust and Solana concepts will help you customize and optimize your contracts more effectively.',
        },
        {
            question: 'What types of contracts can I build?',
            answer: 'You can build various Solana programs including token contracts, NFT contracts, DeFi programs, escrow systems, and payment programs. We provide templates for common use cases and support custom contract generation.',
        },
        {
            question: 'Can I deploy to mainnet?',
            answer: 'Yes! Lovable for Anchor supports one-click deployment to Solana Devnet, Testnet, and Mainnet. We also provide CLI commands and track deployed program IDs for easy management.',
        },
        {
            question: 'Does it generate client code for my contract?',
            answer: 'Absolutely! The platform automatically generates TypeScript/JavaScript client SDKs with typed functions for each instruction, wallet integration, and helper functions for PDAs and transactions.',
        },
        {
            question: 'What about security?',
            answer: 'Our AI assistant warns about known vulnerabilities like unchecked seeds and missing payer checks. We also provide an AI-powered security checklist covering seeds, admin restrictions, and rent exemption checks.',
        },
        {
            question: 'How do I test my contracts?',
            answer: 'The platform auto-generates Anchor test scripts and allows you to simulate transactions in-browser or on devnet before deployment. You can also test frontend integrations with our interactive sandbox.',
        },
    ];

    const toggleFaq = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section
            id="faq"
            className="relative min-h-screen bg-light px-6 md:px-12 lg:px-20 py-16 lg:py-20 z-10"
        >
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: `
        radial-gradient(circle, rgb(108, 68, 252) 2px, transparent 2px)
      `,
                    backgroundSize: '40px 40px',
                    backgroundPosition: '0 0',
                }}
            />
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                    <div className="flex flex-col items-start justify-start gap-8 lg:gap-12">
                        <h1
                            className={cn(
                                'text-6xl lg:text-[12rem] font-black text-dark-base leading-tight text-left bg-light z-10 select-none',
                                doto.className,
                            )}
                        >
                            FAQs
                        </h1>
                        <div className="absolute bottom-2 left-0 md:bottom-12 md:left-10 text-[10px] md:text-[18px] z-10 bg-light p-3">
                            <div className="md:max-w-2xl max-w-sm flex flex-col justify-start items-start text-dark text-md font-normal">
                                <span>Spotted an issue?</span>
                                <span>Help us improve — open it on GitHub.</span>
                                <div className="flex items-end justify-center gap-x-2 md:gap-x-3 mt-2">
                                    <Button className="font-semibold text-xs md:text-base !px-4 md:!px-6 rounded-[4px]">
                                        <FaGithub className="mr-2" />
                                        GitHub
                                    </Button>
                                    <span className="font-light text-primary tracking-wide md:text-xs border-b border-primary py-1 cursor-pointer">
                                        Stay in the loop
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 bg-light z-10 py-6 px-6">
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
        </section>
    );
}
