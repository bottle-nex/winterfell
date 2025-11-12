'use client'
import { useState } from "react";

interface DocsContentSidebarProps {
    contents: string[];
    onSelect: (index: number) => void;
}

export default function DocsContentSidebar({contents, onSelect}: DocsContentSidebarProps) {
    const [activeIndex, setActiveIndex] = useState<number>(1);
    const calculatePosition = (index: number) => {
        return index * 44;
    };

    function handleClick(index: number) {
        if (index === 0) return;
        setActiveIndex(index);
        onSelect(index);
    }
    return (
        <div className="fixed mt-10 flex flex-col text-left gap-y-7 text-xs tracking-wide text-light/70 justify-end">
            <div
                className="absolute -left-4 h-3 w-[2px] rounded-full bg-white shadow-[0_0_12px_3px_rgba(255,255,255,0.9)] transition-all duration-500 ease-out"
                style={{
                    top: `${calculatePosition(activeIndex)}px`,
                }}
            />

            {contents.map((content, index) => (
                <div
                    key={content}
                    onClick={() => handleClick(index)}
                    className={`tracking-wider select-none relative transition-colors duration-300 w-[10rem]
              ${index === 0 ? 'text-white/60 cursor-default select-none' : activeIndex === index ? 'text-white' : 'hover:text-white'}
            `}
                >
                    {content}
                </div>
            ))}
        </div>

    )
}