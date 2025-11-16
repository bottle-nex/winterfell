import { JSX } from "react";
import { FaRocket, FaShieldAlt, FaBolt } from "react-icons/fa";
import { HiOutlineArrowRight } from "react-icons/hi";
import DocsHeading from "../../ui/DocsHeading";
import Image from "next/image";
import ClientExpandableSteps from "./ClientExpandableCard";
import { exportingSteps } from "./epxoting_steps";

interface Feature {
    icon: JSX.Element;
    title: string;
    description: string;
}

export default function ClientDocsExporting(): JSX.Element {
    const features: Feature[] = [
        {
            icon: <FaBolt className="w-6 h-6" />,
            title: "Lightning Fast",
            description: "Export your contracts in seconds with optimized workflows"
        },
        {
            icon: <FaShieldAlt className="w-6 h-6" />,
            title: "Secure Transfer",
            description: "End-to-end encryption ensures your code stays protected"
        },
        {
            icon: <FaRocket className="w-6 h-6" />,
            title: "Auto Deploy",
            description: "Optional CI/CD pipeline integration for instant deployment"
        }
    ];

    return (
        <div className="w-full flex flex-col gap-y-8 items-start text-left max-w-[85%] mx-auto py-8 text-light">
            <DocsHeading firstText='Exporting' secondText="Contracts" />

            <div className="w-full p-8 rounded-[8px] overflow-hidden relative">
                <Image
                    fill
                    unoptimized
                    src={"/images/e2b.png"}
                    alt=""
                />

                <div className="relative grid grid-cols-[1fr_auto_1fr] items-center gap-x-8">

                    <div className="aspect-square relative">
                        <Image
                            src={"/icons/winterfell.jpeg"}
                            fill
                            alt=""
                            className="rounded-full"
                        />
                    </div>

                    <div className="flex flex-col items-center gap-y-2 px-8">
                        <div className="flex items-center gap-x-2 relative">
                            <div className="h-0.5 w-32 relative bg-dark" />

                            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-dark shadow-[0_0_20px_var(--color-primary)]">
                                <HiOutlineArrowRight className="w-5 h-5 text-light" />
                            </div>
                            <div className="h-0.5 w-32 relative bg-dark" />
                        </div>
                    </div>

                    <div className="aspect-square relative">
                        <Image
                            src={"/icons/github.png"}
                            fill
                            alt=""
                        />
                    </div>
                </div>
            </div>

            <div className="w-full border border-neutral-800 rounded-lg overflow-hidden">
                <ClientExpandableSteps
                    title="Export Workflow"
                    steps={exportingSteps}
                />
            </div>

            <div className="w-full">
                <h3 className="text-2xl font-bold mb-6 text-light">
                    Why Export with <span className="text-primary">Winterfell</span>?
                </h3>
                <div className="grid grid-cols-3 gap-4">
                    {features.map((feature: Feature, idx: number) => (
                        <div key={idx} className="p-6 rounded-[8px] group cursor-pointer transition-all hover:-translate-y-1 bg-dark border border-primary/10">
                            <div className="w-12 h-12 rounded-[4px] flex items-center justify-center mb-4 transition-all group-hover:scale-110 bg-primary/10 text-primary">
                                {feature.icon}
                            </div>
                            <h4 className="font-bold text-lg mb-2 text-light">
                                {feature.title}
                            </h4>
                            <p className="text-sm leading-relaxed text-light/70">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="w-full p-6 rounded-[8px] flex items-center justify-between bg-gradient-to-b from-primary to-primary">
                <div>
                    <h3 className="text-xl font-bold mb-1 text-light">
                        Ready to export your first contract?
                    </h3>
                    <p className="text-sm text-light/90">
                        Connect your GitHub account and start deploying in minutes
                    </p>
                </div>
                <button className="px-6 py-3 rounded-[4px] font-semibold flex items-center gap-x-2 transition-all hover:translate-x-1 bg-light text-primary">
                    Get Started
                    <HiOutlineArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}