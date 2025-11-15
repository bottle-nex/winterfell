import { contents } from '@/src/const/docsSidebarValues';
import { useState } from 'react';
import { ClientDocsPanel } from '@/src/types/docs-types';

interface ClientDocsSidebarProps {
    switchPanel: (index: number, panel: ClientDocsPanel) => void;
}

export default function ClientDocsRightSidebar({ switchPanel }: ClientDocsSidebarProps) {
    const [activeIndex, _setActiveIndex] = useState<number>(1);

    function calculatePosition(index: number) {
        return index * 37.5;
    }

    return (
        <div className="h-full z-50 fixed w-[20vw] flex flex-col top-22 items-start px-8">
            <div className="flex fixed flex-col gap-y-5 text-left text-xs tracking-wide text-light/70">
                <div
                    className="absolute -left-4 top-4 h-3 w-0.5 rounded-full bg-primary shadow-[0_1px_8px_2px_rgba(108,68,252,0.8)] transition-all duration-500 ease-out"
                    style={{
                        top: `${calculatePosition(activeIndex)}px`,
                    }}
                />

                {contents.map((content, index) => (
                    <span
                        key={content.type}
                        onClick={() => switchPanel(index, content.type)}
                        className={`tracking-wider select-none relative transition-colors duration-300 cursor-pointer text-[13px]
                                ${activeIndex === index ? 'text-white' : 'hover:text-white'}
                                `}
                    >
                        {content.title}
                    </span>
                ))}
            </div>
        </div>
    );
}
