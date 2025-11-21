'use client';
import OpacityBackground from './OpacityBackground';
import useShortcuts from '@/src/hooks/useShortcut';
import { cn } from '@/src/lib/utils';
import { useState } from 'react';

export default function ShortcutMenu() {
    const [open, setOpen] = useState<boolean>(false);
    useShortcuts({
        'meta+/': () => setOpen((o) => !o),
        'ctrl+/': () => setOpen((o) => !o),
    });
    if (!open) return null;

    const shortcuts = [
        { keys: ['⌘', 'J'], desc: 'Open Terminal' },
        { keys: ['⌘', '/'], desc: 'Show Shortcuts' },
        { keys: ['⌘', 'E'], desc: 'Toggle Sidebar' },
        { keys: ['⌘', 'K'], desc: 'Open searchbar' },
    ];

    return (
        <OpacityBackground onBackgroundClick={() => setOpen((prev) => !prev)}>
            <div className="bg-dark-base border border-neutral-800 rounded-[8px] w-full max-w-md overflow-hidden px-6 py-4">
                <h1 className="text-xl font-semibold text-white text-left mb-3">Keyboard shortcuts</h1>
                <div>
                    {shortcuts.map((shortcut, index) => (
                        <ShortcutItem
                            key={index}
                            keys={shortcut.keys}
                            desc={shortcut.desc}
                            isLast={index === shortcuts.length - 1}
                        />
                    ))}
                </div>
            </div>
        </OpacityBackground>
    );
}

function ShortcutItem({ desc, keys, isLast }: { desc: string; keys: string[]; isLast: boolean }) {
    return (
        <div
            className={cn(
                'flex justify-between items-center py-2.5 px-2 transition-colors',
                !isLast && 'border-b border-neutral-800'
            )}
        >
            <span className="text-sm text-neutral-200">{desc}</span>
            <div className="flex items-center gap-1.5">
                {keys.map((key, index) => (
                    <kbd
                        key={index}
                        className="min-w-7 h-7 flex items-center justify-center bg-dark rounded-[4px] text-sm font-medium text-neutral-100 border border-neutral-800"
                    >
                        {key}
                    </kbd>
                ))}
            </div>
        </div>
    );
}