import { Message } from '@repo/database';
import { LucideLoaderCircle } from 'lucide-react';
import { IoIosCheckmarkCircle } from 'react-icons/io';
import { MdError } from 'react-icons/md';
import { TextShimmer } from '../ui/shimmer-text';
import { useBuilderChatStore } from '@/src/store/code/useBuilderChatStore';

export default function BuilderChatSystemMessage({ message }: { message: Message }) {
    const { planning, generatingCode, building, creatingFiles, finalzing, error } = message;
    const { phase } = useBuilderChatStore();

    return (
        <div className="flex flex-col gap-y-2 mt-3">
            <div>
                <div className="flex items-center gap-x-2">
                    {!planning && !error ? (
                        <LucideLoaderCircle className="animate-spin w-4 h-4 text-blue-400" />
                    ) : error ? (
                        <MdError className="w-4 h-4 text-red-500" />
                    ) : (
                        <IoIosCheckmarkCircle className="w-5 h-5 text-primary stroke-light" />
                    )}
                    <div className="text-[14px] text-light/80 tracking-wider">Planning</div>
                </div>
                {!planning && !error && (
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

            {/* Generating Code Phase */}
            {planning && (
                <div>
                    <div className="flex items-center gap-x-2">
                        {!generatingCode && !error ? (
                            <LucideLoaderCircle className="animate-spin w-4 h-4 text-blue-400" />
                        ) : error ? (
                            <MdError className="w-4 h-4 text-red-500" />
                        ) : (
                            <IoIosCheckmarkCircle className="w-5 h-5 text-primary stroke-light" />
                        )}
                        <div className="text-[14px] text-light/80 tracking-wider">
                            Generating Code
                        </div>
                    </div>
                    {!generatingCode && !error && (
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

            {/* Building Phase */}
            {generatingCode && (
                <div>
                    <div className="flex items-center gap-x-2">
                        {!building && !error ? (
                            <LucideLoaderCircle className="animate-spin w-4 h-4 text-blue-400" />
                        ) : error ? (
                            <MdError className="w-4 h-4 text-red-500" />
                        ) : (
                            <IoIosCheckmarkCircle className="w-5 h-5 text-primary stroke-light" />
                        )}
                        <div className="text-[14px] text-light/80 tracking-wider">Building</div>
                    </div>
                    {!building && !error && (
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

            {/* Creating Files Phase */}
            {building && (
                <div>
                    <div className="flex items-center gap-x-2">
                        {!creatingFiles && !error ? (
                            <LucideLoaderCircle className="animate-spin w-4 h-4 text-blue-400" />
                        ) : error ? (
                            <MdError className="w-4 h-4 text-red-500" />
                        ) : (
                            <IoIosCheckmarkCircle className="w-5 h-5 text-primary stroke-light" />
                        )}
                        <div className="text-[14px] text-light/80 tracking-wider">
                            Creating Files
                        </div>
                    </div>
                    {!creatingFiles && !error && (
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
                            <TextShimmer duration={1.2} className="pt-2 text-light/60 italic">
                                {phase}
                            </TextShimmer>
                        </div>
                    )}
                </div>
            )}

            {/* Finalizing Phase */}
            {creatingFiles && (
                <div>
                    <div className="flex items-center gap-x-2">
                        {!finalzing && !error ? (
                            <LucideLoaderCircle className="animate-spin w-4 h-4 text-blue-400" />
                        ) : error ? (
                            <MdError className="w-4 h-4 text-red-500" />
                        ) : (
                            <IoIosCheckmarkCircle className="w-5 h-5 text-primary" />
                        )}
                        <div className="text-[14px] text-light/80 tracking-wider">Finalizing</div>
                    </div>
                    {!finalzing && !error && (
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
                            <TextShimmer duration={1.4} className="pt-2 text-light/60 italic">
                                {phase}
                            </TextShimmer>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
