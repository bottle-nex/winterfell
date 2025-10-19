"use client";

import React from "react";
import { motion, MotionValue, useScroll, useTransform } from "framer-motion";
import { FaRust } from "react-icons/fa";
import ArchitectureTitleComponent from "./ArchitectureTitleComponent";
import FeatureOne from "./FeatureOne";

const productMetaOptions = [
    {
        title: "CodeGenie",
        subtitle: "Magic contract creation",
        description:
            "CodeGenie lets you write full Solana smart contracts using plain English. It automatically generates complete Anchor programs with all instructions, accounts, and serialization logic, saving you hours of manual coding while ensuring correctness and adherence to Solana best practices.",
    },
    {
        title: "EditWizard",
        subtitle: "Instant tweaks",
        description:
            "EditWizard allows you to easily modify existing smart contracts through chat or direct code edits. It intelligently maintains Anchor conventions, syntax, and safety checks, while applying your requested changes so you can improve or refactor programs confidently and quickly.",
    },
    {
        title: "DeployBot",
        subtitle: "One-click launch",
        description:
            "DeployBot simplifies deploying and interacting with your Solana programs. With a single click, it compiles, deploys, and generates IDLs and client SDKs, letting you instantly test and interact with your program without leaving the platform or writing extra scripts.",
    },
];

export default function WhoWeAre() {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    return (
        <>
            <ArchitectureTitleComponent />
            <div ref={containerRef} className="bg-[#0a0c0d] w-screen">
                <div className="grid grid-cols-2 gap-0">
                    <div className="h-screen sticky top-0 flex items-center justify-center bg-[#0a0c0d]">
                        <RustLogo scrollYProgress={scrollYProgress} />
                    </div>

                    <div className="min-h-[300vh] flex flex-col justify-between z-10 bg-[#0a0c0d]">
                        {productMetaOptions.map((option, index) => (
                            <FeatureOne
                                key={index}
                                title={option.title}
                                subTitle={option.subtitle}
                                description={option.description}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

function RustLogo({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
    const waveY = useTransform(scrollYProgress, [0, 1], [300, 0]);

    return (
        <div className="relative w-[300px] h-[300px] flex items-center justify-center">
            <FaRust size={300} className="text-neutral-800 absolute" />

            <svg
                className="absolute w-full h-full top-0 left-0"
                viewBox="0 0 300 300"
                preserveAspectRatio="none"
            >
                <defs>
                    <mask id="waveMask">
                        <motion.rect
                            x="0"
                            width="300"
                            height="300"
                            fill="white"
                            style={{
                                y: waveY,
                            }}
                        />
                    </mask>
                </defs>

                <FaRust
                    size={300}
                    className="text-[#6C44FC]"
                    style={{ mask: "url(#waveMask)", WebkitMask: "url(#waveMask)" }}
                />
            </svg>
        </div>
    );
}
