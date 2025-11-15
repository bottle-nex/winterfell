import { contents } from '@/src/const/docsSidebarValues';
import { ClientDocsPanel } from '@/src/types/docs-types';
import { Dispatch, SetStateAction, useState } from 'react';

interface ClientDocsSidebarProps {
    setClientPanel: Dispatch<SetStateAction<ClientDocsPanel>>;
}

export default function ClientDocsSidebar({ setClientPanel }: ClientDocsSidebarProps) {
    const [activeIndex, setActiveIndex] = useState<number>(1);
    function calculatePosition(index: number) {
        return index * 37.5;
    }

    function switchPanel(index: number, clientPanel: ClientDocsPanel) {
        if (index === 0) return;
        setActiveIndex(index);
        setClientPanel(clientPanel);
    }

    return (
        <div className="min-h-screen z-50 bg-dark/30 border-l border-neutral-800">
            <div className="flex fixed flex-col gap-y-5 text-left tracking-wide text-light/70 mt-22 pl-10">
                <div
                    className="absolute left-5 top-4 h-3 w-0.5 rounded-full bg-primary shadow-[0_1px_8px_2px_rgba(108,68,252,0.8)] transition-all duration-500 ease-out"
                    style={{
                        top: `${calculatePosition(activeIndex)}px`,
                    }}
                />

                {contents.map((content, index) => (
                    <span
                        key={content.type}
                        onClick={() => switchPanel(index, content.type)}
                        className={`tracking-wider select-none relative transition-colors duration-300 cursor-pointer text-[13px]
                                ${index === 0 ? 'text-white/60 cursor-default select-none text-2xl' : activeIndex === index ? 'text-white' : 'hover:text-white text-xs'}
                                `}
                    >
                        {content.title}
                    </span>
                ))}
            </div>
        </div>
    );
}
