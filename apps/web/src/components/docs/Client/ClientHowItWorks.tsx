'use client'
import Image from "next/image"

export default function ClientHowItWorks() {
    return (
        <div className="w-full min-h-screen py-10 h-full flex flex-col items-start text-left tracking-wide gap-y-5">
            <div className="text-3xl">
                How It Works
            </div>

            <div className="flex flex-col gap-y-4 h-full">
                {/* <div className="text-[18px] tracking-wider">
                    Let’s first dive into what Winterfell actually does <span className="text-light/40 hover:text-[#a187fc] transition-colors duration-300">(because its kind of cool)</span>.
                </div> */}

                <div className="flex flex-col gap-y-4 tracking-wide text-light/90">
                    <TitleDescription
                        title="Contract Creation"
                        description="In Winterfell, you can craft anything from beginner-friendly to brain-meltingly complex contracts - all from a single prompt."
                    />

                    <TitleDescription
                        title="Winter Shell"
                        description="Meet winter, our built-in terminal to chat directly with your Anchor contracts - like talking to your code, but cooler."
                    />

                    <TitleDescription
                        title="Test & Build"
                        description="Run tests, compile, and build straight from Winter Shell. No setup drama - just type and run."
                    />

                    <TitleDescription
                        title="Deploy"
                        description="Ship your contracts to the Solana blockchain (Mainnet or Devnet). Just connect your wallet and boom - it’s live."
                    />

                    <TitleDescription
                        title="Export Code"
                        description="Push your project to GitHub or grab it as a zip. Your code, your way, nicely packaged."
                    />

                    <TitleDescription
                        title="Plans"
                        description="Stuck with limited generations or builds, we have affordable plans [PREMIUM/ PREMIUM PLUS] for you."
                    />
                </div>
            </div>

            <div className="h-full w-full relative flex-1 border border-neutral-800 rounded-[4px]">
                <Image
                    src={'/Images/winterfell-architecture.png'}
                    alt="winterfell-client-architecture"
                    fill
                    className="object-contain p-2 rounded-[4px]"
                    unoptimized
                />                
            </div>
        </div>
    )
}

function TitleDescription({ title, description }: { title: string, description: string }) {
    return (
        <div className="flex flex-col gap-x-1">
            <div className="text-light/90 font-semibold tracking-wider">
                • {title}:
            </div>

            <div className="text-light/70 pl-2.5">
                {description}
            </div>
        </div>
    )
}
