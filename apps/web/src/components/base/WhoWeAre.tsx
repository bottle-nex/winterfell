import ArchitectureTitleComponent from './ArchitectureTitleComponent';
import FeatureOne from './FeatureOne';

const productMetaOptions = [
    {
        title: 'CodeGenie',
        subtitle: 'Magic contract creation',
        description:
            'Write Solana smart contracts using plain English. Automatically generates full Anchor programs with correct structure, instructions, and serialization.',
    },
    {
        title: 'EditWizard',
        subtitle: 'Instant tweaks',
        description:
            'Modify existing programs through chat or code edits. AI maintains syntax, Anchor patterns, and best practices while applying your changes.',
    },
    {
        title: 'DeployBot',
        subtitle: 'One-click launch',
        description:
            'Seamlessly compile, deploy, and generate IDLs and client SDKs. Instantly test and interact with your program without leaving the platform.',
    },
];

export default function WhoWeAre() {
    return (
        <>
            <ArchitectureTitleComponent />
            <div className="bg-[#0a0c0d] w-screen">
                <div className="grid grid-cols-2 gap-0">
                    <div className="h-screen sticky top-0 flex items-center justify-center bg-[#0a0c0d]">
                        <div className="text-white text-2xl">Left Content (Sticky)</div>
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
