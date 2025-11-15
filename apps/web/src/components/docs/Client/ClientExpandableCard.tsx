import React, { useState } from 'react';
import { Button } from '../../ui/button';
import { IoMdArrowDropdown, IoMdArrowDropright } from 'react-icons/io';

export interface ExpandableStepsProps {
    title: string;
    steps: { number: number; title: string; description: string | React.ReactNode }[];
}

export default function ClientExpandableSteps({ title, steps }: ExpandableStepsProps) {
    const [isExpanded, setIsExpanded] = useState<boolean>(false);

    return (
        <div className="bg-[#111111] border-b last:border-0 border-neutral-800 overflow-hidden">
            <Button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between p-4 py-6 bg-dark-base/90 hover:bg-dark-base/50 transition-colors"
            >
                <div className="flex items-center gap-2">
                    {isExpanded ? (
                        <IoMdArrowDropdown className="w-5 h-5 text-light/70" />
                    ) : (
                        <IoMdArrowDropright className="w-5 h-5 text-light/70" />
                    )}
                    <h2 className="text-light/80 text-md tracking-wider">{title}</h2>
                </div>
            </Button>

            {isExpanded && (
                <div className="px-4 py-4">
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className="flex gap-4 pb-6 last:pb-1 relative tracking-wider"
                        >
                            {index < steps.length - 1 && (
                                <div className="absolute left-4 top-8 bottom-0 w-px border-l-2 border-dotted border-neutral-700" />
                            )}

                            <div className="shrink-0 w-8 h-8 rounded-full bg-dark-base border border-neutral-800 flex items-center justify-center text-light text-sm font-medium z-10 relative">
                                {step.number}
                            </div>

                            <div className="flex-1 pt-1">
                                <h3 className="text-light/80 text-md font-semibold mb-2">
                                    {step.title}
                                </h3>
                                <div className="text-light/60 text-sm leading-relaxed">
                                    {step.description}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
