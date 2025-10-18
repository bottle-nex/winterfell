import { Message } from '@repo/database';
import { LucideLoaderCircle } from 'lucide-react';
import { IoIosCheckmarkCircle } from 'react-icons/io';
import { MdError } from 'react-icons/md';
import { TextShimmer } from '../ui/shimmer-text';
import { useBuilderChatStore } from '@/src/store/code/useBuilderChatStore';

export default function BuilderChatSystemMessage({ message }: { message: Message }) {
    const { buildStart, buildProgress, buildComplete, buildError } = message;
    const { phase } = useBuilderChatStore();
    return (
        <div className="flex flex-col gap-y-2 mt-2">
            <div>
                <div className="flex items-center gap-x-2">
                    {!buildStart && !buildError ? (
                        <LucideLoaderCircle className="animate-spin w-4 h-4 text-blue-400" />
                    ) : buildError ? (
                        <MdError className="w-4 h-4 text-red-500" />
                    ) : (
                        <IoIosCheckmarkCircle className="w-4 h-4 text-green-500" />
                    )}
                    <div className="text-[14px] text-light/80 tracking-wide">Build Start</div>
                </div>
                {!buildStart && (
                    <div className="ml-1.5 relative flex items-end justify-start gap-x-2">
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M 0 0 L 0 17 Q 0 20 8 20 L 20 20"
                                stroke="#e5e7eb"
                                strokeWidth="2"
                                fill="none"
                                strokeLinecap="round"
                            />
                        </svg>
                        <TextShimmer duration={1.3} className="pt-2 text-light/60 italic">
                            {phase}
                        </TextShimmer>
                    </div>
                )}
            </div>

            {buildStart && (
                <div>
                    <div className="flex items-center gap-x-2">
                        {!buildProgress && !buildError ? (
                            <LucideLoaderCircle className="animate-spin w-4 h-4 text-blue-400" />
                        ) : buildError ? (
                            <MdError className="w-4 h-4 text-red-500" />
                        ) : (
                            <IoIosCheckmarkCircle className="w-4 h-4 text-green-500" />
                        )}
                        <div className="text-[14px] text-light/80 tracking-wide">
                            Build Progress
                        </div>
                    </div>
                    {buildStart && !buildProgress && (
                        <div className="ml-1.5 relative flex items-end justify-start gap-x-2">
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M 0 0 L 0 17 Q 0 20 8 20 L 20 20"
                                    stroke="#e5e7eb"
                                    strokeWidth="2"
                                    fill="none"
                                    strokeLinecap="round"
                                />
                            </svg>
                            <TextShimmer duration={1.5} className="pt-2 text-light/60 italic">
                                {phase}
                            </TextShimmer>
                        </div>
                    )}
                </div>
            )}

            {buildProgress && (
                <div>
                    <div className="flex items-center gap-x-2">
                        {!buildComplete && !buildError ? (
                            <LucideLoaderCircle className="animate-spin w-4 h-4 text-blue-400" />
                        ) : buildError ? (
                            <MdError className="w-4 h-4 text-red-500" />
                        ) : (
                            <IoIosCheckmarkCircle className="w-4 h-4 text-green-500" />
                        )}
                        <div className="text-[14px] text-light/80 tracking-wide">
                            Build Complete
                        </div>
                    </div>
                    {buildProgress && !buildComplete && (
                        <div className="ml-1.5 relative flex items-end justify-start gap-x-2">
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M 0 0 L 0 17 Q 0 20 8 20 L 20 20"
                                    stroke="#e5e7eb"
                                    strokeWidth="2"
                                    fill="none"
                                    strokeLinecap="round"
                                />
                            </svg>
                            <TextShimmer duration={1} className="pt-2 text-light/60 italic">
                                {phase}
                            </TextShimmer>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
