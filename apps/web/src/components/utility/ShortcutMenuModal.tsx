'use client'

import { useShortcutMenuToggle } from "@/src/hooks/useShortcutMenuToggle";
import OpacityBackground from "./OpacityBackground";

export default function ShortcutMenu() {
    const { open, setOpen } = useShortcutMenuToggle();

    if (!open) return null;

    return (
        <OpacityBackground>
            <div className="bg-[#353535] rounded-lg w-[420px] p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="font-semibold text-lg">Keyboard Shortcuts</h2>
                    <button onClick={() => setOpen(false)}>✕</button>
                </div>

                <div className="space-y-3">
                    <ShortcutItem keys="⌘ K" desc="Open Command Palette" />
                    <ShortcutItem keys="⌘ /" desc="Search" />
                    <ShortcutItem keys="⌘ ?" desc="Show Shortcuts" />
                    <ShortcutItem keys="⌘ S" desc="Save" />
                    <ShortcutItem keys="⌘ I" desc="Toggle Sidebar" />
                </div>

                <p className="text-xs opacity-50 mt-4 text-center">
                    Press ⌘ + / to close
                </p>
            </div>
        </OpacityBackground>
    );
}

function ShortcutItem({ desc, keys }: { desc: string; keys: string }) {
    return (
        <div className="flex justify-between items-center">
            <span>{desc}</span>
            <kbd className="bg-zinc-200 dark:bg-zinc-700 px-2 py-1 rounded text-sm font-mono">
                {keys}
            </kbd>
        </div>
    );
}
