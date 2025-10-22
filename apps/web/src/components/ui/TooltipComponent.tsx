import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';

interface ToolTipComponentProps {
    children: React.ReactNode;
    content: React.ReactNode;
    className?: string;
    side?: 'top' | 'bottom' | 'left' | 'right';
    duration?: number;
}

export default function ToolTipComponent({
    children,
    className,
    content,
    side = 'bottom',
    duration = 300,
}: ToolTipComponentProps) {
    return (
        <TooltipProvider skipDelayDuration={0} delayDuration={duration}>
            <Tooltip>
                <TooltipTrigger asChild>{children}</TooltipTrigger>
                <TooltipContent className={className} side={side} sideOffset={5}>
                    <span>{content}</span>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
