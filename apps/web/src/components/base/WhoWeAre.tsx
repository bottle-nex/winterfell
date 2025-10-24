'use client';

import React from 'react';
import ArchitectureTitleComponent from './ArchitectureTitleComponent';
import FeatureOne from './FeatureOne';

const productMetaOptions = [
    {
        title: 'CodeGenie',
        subtitle: 'Magic contract creation',
        description:
            'CodeGenie lets you write full Solana smart contracts using plain English. It automatically generates complete Anchor programs with all instructions, accounts, and serialization logic, saving you hours of manual coding while ensuring correctness and adherence to Solana best practices.',
    },
    {
        title: 'EditWizard',
        subtitle: 'Instant tweaks',
        description:
            'EditWizard allows you to easily modify existing smart contracts through chat or direct code edits. It intelligently maintains Anchor conventions, syntax, and safety checks, while applying your requested changes so you can improve or refactor programs confidently and quickly.',
    },
    {
        title: 'DeployBot',
        subtitle: 'One-click launch',
        description:
            'DeployBot simplifies deploying and interacting with your Solana programs. With a single click, it compiles, deploys, and generates IDLs and client SDKs, letting you instantly test and interact with your program without leaving the platform or writing extra scripts.',
    },
];

export default function WhoWeAre() {
    const containerRef = React.useRef<HTMLDivElement>(null);

    return (
        <>
            <ArchitectureTitleComponent />
            <section ref={containerRef} className="bg-[#0a0c0d] w-screen">
                <div className="grid grid-cols-2 gap-0">
                    <div className="h-screen sticky top-0 flex items-center justify-center bg-[#0a0c0d]">
                        left content (sticky)
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
            </section>
        </>
    );
}
