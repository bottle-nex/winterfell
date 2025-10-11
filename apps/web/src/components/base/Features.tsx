'use client';
import Image from 'next/image';

export default function Features() {
    return (
        <section className="w-full flex flex-col md:flex-row max-w-6xl mx-auto py-20 px-4 gap-x-16 relative">
            <div className="md:w-1/3 flex-shrink-0">
                <div className="md:sticky md:top-24 font-bold text-5xl leading-[1.2] text-[#F2EFEC] whitespace-nowrap flex flex-col">
                    <span>SIMPLIFY WRITING</span>
                    <span>CONTRACTS</span>
                </div>
            </div>

            <div className="md:w-2/3 flex flex-col space-y-15">
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="h-[400px] w-full md:w-[500px] shadow-xl rounded-[8px] p-5 space-y-2 bg-[#0f0f0f] mx-auto"
                    >
                        <div className="w-full h-[65%] border border-neutral-700 rounded-[4px] relative overflow-hidden">
                            <Image
                                src={'/Images/vscode.png'}
                                alt=""
                                fill
                                className="object-cover"
                                unoptimized
                            />
                        </div>
                        <div className="w-full h-[35%] space-y-2 py-2 flex flex-col justify-center">
                            <div className="text-[22px] font-extralight tracking-wider text-[#c2c2c2]">
                                Give Inputs
                            </div>
                            <div className="text-[#a5a3a1] text-sm tracking-wide">
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum, sint
                                fugit! Sunt assumenda laudantium.
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
