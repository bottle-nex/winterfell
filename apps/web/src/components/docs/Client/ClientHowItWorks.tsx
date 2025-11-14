'use client';
import Image from 'next/image';

export default function ClientHowItWorks() {
    return (
        <div className="w-full h-full py-10 flex flex-col items-center text-left tracking-wide gap-y-5 ">
            <div className="flex flex-col gap-y-4 h-full ">
                <div className="text-3xl">How It Works</div>
                {/* <div className="text-[18px] tracking-wider">
                    Let’s first dive into what Winterfell actually does <span className="text-light/40 hover:text-[#a187fc] transition-colors duration-300">(because its kind of cool)</span>.
                </div> */}

                <div className="flex flex-col gap-y-4 tracking-wide text-light/90">
                    <TitleDescription
                        title="Contract Creation"
                        description="You write a prompt and get redircted to the /playground endpoint."
                    />

                    <TitleDescription
                        title="Contract updates and refinement"
                        description="Make changes in your contract, refine them using reprompts."
                    />

                    <TitleDescription
                        title="Test the contract"
                        description="Run test commands, [ winter test ], through winter shell and see the test logs."
                    />

                    <TitleDescription
                        title="Build the contract"
                        description="Run build command, [ winter build ], through winter shell to build the contract and view build logs directly in the shell."
                    />

                    <TitleDescription
                        title="Export your custom contract"
                        description="Either sign-in through GitHub and export the codebase or download the zip file."
                    />

                    <TitleDescription
                        title="Deployment"
                        description="Deploy your custom generated contract directly on the mainnet/devnet of the SOLANA network."
                    />
                </div>
            </div>

            <div className="h-full w-full max-w-4xl relative border border-neutral-800 rounded-[4px]">
                <Image
                    src={'/Images/winterfell-architecture.png'}
                    alt="winterfell-client-architecture"
                    fill
                    className="object-contain p-2 rounded-[4px]"
                    unoptimized
                />
            </div>
        </div>
    );
}

export function TitleDescription({ title, description }: { title: string; description: string }) {
    return (
        <div className="flex flex-col gap-x-1">
            <div className="text-light/90 font-semibold tracking-wider">• {title}:</div>

            <div className="text-light/70 pl-2.5">{description}</div>
        </div>
    );
}
