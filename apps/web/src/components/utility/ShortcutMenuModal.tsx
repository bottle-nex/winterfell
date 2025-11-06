'use client'

import { useShortcutMenuToggle } from "@/src/hooks/useShortcutMenuToggle";
import OpacityBackground from "./OpacityBackground";
import { RxCross2 } from "react-icons/rx";

export default function ShortcutMenu() {
    const { open, setOpen } = useShortcutMenuToggle();

    if (!open) return null;

    return (
        <OpacityBackground onBackgroundClick={() => setOpen(prev => !prev)}>
            <div className="fixed left-5 bottom-5 z-50 backdrop-blur-sm flex items-center justify-center">
                <div className="bg-dark-base/80 border border-[#353535] rounded-lg w-[250px] py-4 px-6">
                    <div className="flex justify-between items-center mb-5">
                        <div className="text-base tracking-wide">
                            Keyboard Shortcuts
                        </div>
                        {/* <div 
                        className="absolute -top-2 -right-2 bg-dark-base border border-[#353535] rounded-full p-[3px]"
                        onClick={() => setOpen(false)}>
                            <RxCross2 className="size-3 text-light/90"/>
                        </div> */}
                    </div> 

                    <div className="space-y-2.5">
                        <ShortcutItem keys="⌘ K" desc="Open Terminal" />
                        <ShortcutItem keys="⌘ /" desc="Start Chat" />
                        <ShortcutItem keys="⌘ ?" desc="Show Shortcuts" />
                        <ShortcutItem keys="⌘ E" desc="Toggle Sidebar" />
                    </div>

                    <p className="text-xs text-light/60 mt-5 text-center tracking-wider">
                        Press ⌘ + / to close
                    </p>
                </div>
            </div>
        </OpacityBackground>
    );
}

function ShortcutItem({ desc, keys }: { desc: string; keys: string }) {
    return (
        <div className="flex justify-between items-center text-light/90 tracking-wide">
            <span className="text-sm">
                {desc}
            </span>
            <kbd className="px-2 py-1 rounded text-sm font-mono">
                {keys}
            </kbd>
        </div>
    );
}
