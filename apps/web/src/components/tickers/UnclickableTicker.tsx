import { cn } from "@/src/lib/utils";

interface UnclickableTickerProps {
    children: React.ReactNode;
    className?: string;
}

export default function UnclickableTicker({ children, className }: UnclickableTickerProps) {
    return (
        <span
            className={cn(
                'inline-flex items-center gap-x-2 text-[11px] px-2.5 py-1 rounded-full border border-neutral-400 bg-neutral-700 text-neutral-200 shadow-sm shadow-neutral-900 select-none whitespace-nowrap',
                className,
            )}
        >
            {children}
        </span>
    );
}
