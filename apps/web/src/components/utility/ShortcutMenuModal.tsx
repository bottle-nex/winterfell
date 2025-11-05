'use client'

import { useShortcutMenuToggle } from "@/src/hooks/useShortcutMenuToggle";
import OpacityBackground from "./OpacityBackground";
import { RxCross2 } from "react-icons/rx";

export default function ShortcutMenu() {
    const { open, setOpen } = useShortcutMenuToggle();

    if (!open) return null;

    return (
        <OpacityBackground onBackgroundClick={() => setOpen(prev => !prev)}>
            <div className="fixed left-0 bottom-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                <div className="bg-[#111111] border border-[#353535] rounded-lg w-[250px] py-4 px-6">
                    <div className="flex justify-between items-center mb-4">
                        <div className="font-semibold text-base">
                            Keyboard Shortcuts
                        </div>
                        <div onClick={() => setOpen(false)}>
                            <RxCross2 />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <ShortcutItem keys="⌘ K" desc="Open Command Palette" />
                        <ShortcutItem keys="⌘ /" desc="Search" />
                        <ShortcutItem keys="⌘ ?" desc="Show Shortcuts" />
                        <ShortcutItem keys="⌘ S" desc="Save" />
                        <ShortcutItem keys="⌘ I" desc="Toggle Sidebar" />
                    </div>

                    <p className="text-[10px] opacity-50 mt-4 text-center">
                        Press ⌘ + / to close
                    </p>
                </div>
            </div>
        </OpacityBackground>
    );
}

function ShortcutItem({ desc, keys }: { desc: string; keys: string }) {
    return (
        <div className="flex justify-between items-center">
            <span className="text-xs">
                {desc}
            </span>
            <kbd className="px-2 py-1 rounded text-sm font-mono">
                {keys}
            </kbd>
        </div>
    );
}
