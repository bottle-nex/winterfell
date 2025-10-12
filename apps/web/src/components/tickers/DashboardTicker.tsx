import { AnimatedShinyText } from '@/components/ui/animated-shiny-text';
import { cn } from '@/src/lib/utils';
import { ArrowRightIcon } from 'lucide-react';

export default function DashboardTicker() {
    return (
        <div className="z-10 flex items-center justify-center">
            <div
                className={cn(
                    'group rounded-full border border-neutral-800 bg-[#0E0E16] text-base text-light transition-all ease-in hover:cursor-pointer hover:bg-[#0f0f11]',
                )}
            >
                <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
                    <span className="tracking-wide text-light/60 font-normal text-sm">
                        ✨ powered by ai
                    </span>
                    <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5 text-neutral-600" />
                </AnimatedShinyText>
            </div>
        </div>
    );
}
