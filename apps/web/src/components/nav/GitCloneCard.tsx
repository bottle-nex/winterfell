'use client';
import { IoCopyOutline } from 'react-icons/io5';
import { Button } from '../ui/button';
import { useState } from 'react';
import ToolTipComponent from '../ui/TooltipComponent';
import { cn } from '@/src/lib/utils';
import { HiPencil } from 'react-icons/hi2';
import { FiInfo } from 'react-icons/fi';

enum CloneOptions {
    HTTPS = 'HTTPS',
    SSH = 'SSH',
}

export default function GitCloneCard() {
    const [activeTab, setActiveTab] = useState<CloneOptions>(CloneOptions.HTTPS);

    return (
        <div className="flex flex-col gap-y-2 rounded-[8px] overflow-hidden">
            <div className="flex justify-between items-center text-sm pb-1">
                <span>Clone using the web URL</span>
                <ToolTipComponent
                    content="Which remote URL should I use?"
                    className="text-light/80"
                >
                    <FiInfo className="size-4 text-light/70" />
                </ToolTipComponent>
            </div>

            <div className="flex gap-x-2">
                <Button
                    onClick={() => setActiveTab(CloneOptions.HTTPS)}
                    size="xs"
                    className={cn(
                        'text-[11px] tracking-wider font-semibold bg-dark text-light hover:bg-dark hover:brightness-120 border border-transparent',
                        activeTab === CloneOptions.HTTPS
                            ? 'border border-neutral-800 text-dark bg-light hover:bg-light'
                            : '',
                    )}
                >
                    {CloneOptions.HTTPS}
                </Button>
                <Button
                    onClick={() => setActiveTab(CloneOptions.SSH)}
                    size="xs"
                    className={cn(
                        'text-[11px] tracking-wider font-semibold bg-dark text-light hover:brightness-120 border border-transparent hover:bg-dark',
                        activeTab === CloneOptions.SSH
                            ? 'border border-neutral-800 text-dark bg-light hover:bg-light'
                            : '',
                    )}
                >
                    {CloneOptions.SSH}
                </Button>
            </div>

            <div className="flex flex-col items-start">
                {activeTab === CloneOptions.HTTPS ? (
                    <div className="bg-dark/50 border border-neutral-800 p-2 rounded-[4px] flex items-center justify-between w-full tracking-wider">
                        https://github.com/piyush-rj/exness.git
                        <div className="flex gap-x-2">
                            <HiPencil className="hover:-translate-y-[1px]" />
                            <ToolTipComponent content="copy">
                                <IoCopyOutline className="size-3.5 hover:-translate-y-[1px] transition-transform duration-200" />
                            </ToolTipComponent>
                        </div>
                    </div>
                ) : (
                    <div className="bg-dark/50 border border-neutral-800 p-2 rounded-[4px] flex items-center justify-between w-full tracking-wider">
                        git@github.com:piyush-rj/exness.git
                        <div className="flex gap-x-2">
                            <HiPencil className="hover:-translate-y-[1px]" />
                            <ToolTipComponent content="copy">
                                <IoCopyOutline className="size-3.5 hover:-translate-y-[1px] transition-transform duration-200" />
                            </ToolTipComponent>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
