'use client';
import { Rocket } from '../../ui/animated/animated_rocket';
import SafariBrowser from '../../ui/SafariBrowser';
import { cn } from '@/src/lib/utils';
import { Code } from '../../ui/animated/animated_code';
import { useRouter } from 'next/navigation';
import { MdArrowOutward, MdTerminal } from 'react-icons/md';

export default function ClientGettingStarted() {
    const router = useRouter();

    return (
        <div className="w-full h-full py-10 flex flex-col items-center text-left tracking-wide gap-y-5">
            <div className="flex flex-col max-w-4xl w-full h-full">
                <div className="text-3xl">Getting Started</div>

                {/* phase 1 */}
                <div className="flex h-full mt-8 gap-x-8 text-light/90 items-center">
                    <div className="w-full flex flex-col gap-y-4">
                        <div className="text-xl flex items-center gap-x-2">
                            PHASE{' '}
                            <span className="text-primary font-bold text-xl hover:scale-105 transition-all transform-3d duration-200 cursor-pointer">
                                #1
                            </span>{' '}
                            <span className="text-base text-light/60 tracking-wider">
                                {'{'} Root workspace {'}'}
                            </span>
                        </div>

                        <div className="text-light/90 flex flex-col">
                            <span>1. LLM Models</span>
                            <span className="text-light/60">• Gemini</span>
                            <span className="text-light/60">• Claude</span>
                        </div>

                        <div className="flex flex-col text-light/90">
                            <span
                                onClick={() => router.push('/home')}
                                className="mb-1 cursor-pointer flex items-center gap-x-0.5 hover:tracking-wider transition-all transform duration-300"
                            >
                                2. Templates{' '}
                                <MdArrowOutward className="size-5 bg-dark p-[3px] rounded-[4px]" />
                            </span>
                            <span className="text-light/60">
                                • Common starter templates for beginners and advanced developers.
                            </span>
                            <span className="text-light/60">
                                • Keeps a history of contracts you’ve generated.
                            </span>
                            <span className="text-light/60">
                                • Highlights the latest community-built templates.
                            </span>
                        </div>

                        <div className="text-md pt-3 tracking-wider">
                            <span className="font-semibold"># Prompt Suggestions</span>
                        </div>

                        <div className="text-light/60 flex flex-col gap-y-1">
                            <div className="flex flex-col">
                                • Beginners: Start with something simple. for example:{' '}
                                <span className="text-light/90 flex items-center">
                                    ”Create a counter program"
                                </span>
                            </div>
                            <div className="flex flex-col">
                                • Want something more complex? Try prompts like{' '}
                                <span className="text-light">
                                    “Create a DLMM pool...” (and keep going from there).
                                </span>
                            </div>
                        </div>
                    </div>

                    <div
                        className={cn(
                            'h-[28rem] w-[50rem] border border-neutral-800 shadow-xl',
                            'bg-gradient-to-br from-dark via-transparent to-dark rounded-[4px]',
                            'relative overflow-hidden group',
                            'hover:from-light/5 transition-colors transform duration-300',
                        )}
                    >
                        <div className="w-full flex flex-col items-start h-30 px-10 gap-y-[2px] py-6 tracking-wide">
                            <Rocket width={30} height={30} stroke="rgb(200, 200, 200)" />

                            <div className="text-[18px] text-light/80 font-semibold mt-1">
                                First Contract
                            </div>
                            <div className="text-[15px] text-light/70">
                                To get started, just put together a basic prompt
                            </div>
                        </div>

                        <div className="absolute -bottom-11 -right-25 h-[20rem] w-[30rem] rounded-[4px] group-hover:-translate-y-1 transition-all transform duration-300 group-hover:shadow-[0_1px_15px_6px_rgba(92,62,180,0.2)]">
                            <SafariBrowser
                                url="winterfell.dev"
                                imageSrc="/Images/winterfell-dashboard.png"
                            />
                        </div>
                    </div>
                </div>

                {/* phase 2 */}
                <div className="flex h-full mt-30 gap-x-8 text-light/90 items-center">
                    <div className="w-full flex flex-col gap-y-4">
                        <div className="text-xl flex items-center gap-x-2">
                            PHASE{' '}
                            <span className="text-primary font-bold text-xl hover:scale-105 transition-all transform-3d duration-200 cursor-pointer">
                                #2
                            </span>{' '}
                            <span className="text-base tracking-wider text-light/60">
                                {'{'} Playground workspace {'}'}
                            </span>
                        </div>

                        <div className="flex flex-col text-light/90">
                            <span className="mb-1">2. Reprompt & Refine</span>
                            <span className="text-light/60">
                                • Update or regenerate contract logic by simply re-prompting with
                                new requirements.
                            </span>
                        </div>

                        <div className="flex flex-col text-light/90">
                            <span className="mb-1">2. File Explorer</span>
                            <span className="text-light/60">
                                • Browse, search, and navigate through all generated files
                                instantly.
                            </span>
                        </div>

                        <div className="flex flex-col text-light/90">
                            <span className="mb-1">3. Export Code</span>
                            <span className="text-light/60">
                                • Push the entire generated codebase to a GitHub repository in one
                                click.
                            </span>
                            <span className="text-light/60">
                                • Download the zip file and directly use it.
                            </span>
                        </div>

                        <div className="text-light/90 flex flex-col gap-y-1.5">
                            <span>4. Winter shell</span>
                            <span className="text-light/60">
                                • Winterfell has its own terminal called winter.
                            </span>
                            <span className="text-light/60 flex items-center gap-x-2">
                                • Press{' '}
                                <span className="bg-dark px-2 py-0.5 rounded-[4px] text-light/90">
                                    Ctrl + J
                                </span>{' '}
                                to open it or click on the{' '}
                                <span className="bg-dark p-1 px-1.5 rounded-[4px]">
                                    <MdTerminal className="size-5 text-light/90" />
                                </span>{' '}
                                icon.
                            </span>
                        </div>
                    </div>

                    <div
                        className={cn(
                            'h-[28rem] w-[50rem] border border-neutral-800 shadow-xl',
                            'bg-gradient-to-br from-dark via-transparent to-dark rounded-[4px]',
                            'relative overflow-hidden group',
                            'hover:from-light/5 transition-colors transform duration-300',
                        )}
                    >
                        <div className="w-full flex flex-col items-start h-30 px-9 gap-y-[2px] py-6 tracking-wide">
                            <Code width={30} height={30} stroke="rgb(200, 200, 200)" />

                            <div className="text-[18px] text-light/80 font-semibold mt-1">
                                Playground
                            </div>
                            <div className="text-[15px] text-light/70">
                                Continue with updates and changes as needed
                            </div>
                        </div>

                        <div className="absolute -bottom-11 -right-27 h-[20rem] w-[30rem] rounded-[4px] group-hover:-translate-y-1 transition-all transform duration-300 group-hover:shadow-[0_1px_15px_6px_rgba(255,255,255,0.2)]">
                            <SafariBrowser
                                url="winterfell.dev/playground/contractId"
                                imageSrc="/Images/winterfell-playground.png"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
