'use client';
import { useState } from 'react';
import ClientOverview from './ClientOverview';

const contents = [
    'CONTENTS',
    'Overview',
    'How it works',
    'Getting Started',
    'Editing & Understanding',
    'Building & Testing',
    'Deployment',
    'Exporting',
];

export default function ClientDocs() {
    const [activeIndex, setActiveIndex] = useState<number>(1);
    const calculatePosition = (index: number) => {
        return index * 44;
    };

    return (
        <div className="mt-20 relative min-h-screen w-full flex max-w-5xl gap-x-14">
            <div className="w-full h-full max-w-4xl">
                <ClientOverview />
            </div>

            <div className="absolute -right-20 mt-10 flex flex-col text-left gap-y-7 text-xs tracking-wide text-light/70">
                <div
                    className="absolute -left-4 h-3 w-[2px] rounded-full bg-white shadow-[0_0_12px_3px_rgba(255,255,255,0.9)] transition-all duration-500 ease-out"
                    style={{
                        top: `${calculatePosition(activeIndex)}px`,
                    }}
                />

                {contents.map((content, index) => (
                    <span
                        key={content}
                        onClick={() => index !== 0 && setActiveIndex(index)}
                        className={`tracking-wider select-none relative transition-colors duration-300 
              ${index === 0 ? 'text-white/60 cursor-default select-none' : activeIndex === index ? 'text-white' : 'hover:text-white'}
            `}
                    >
                        {content}
                    </span>
                ))}
            </div>
        </div>
    );
}
