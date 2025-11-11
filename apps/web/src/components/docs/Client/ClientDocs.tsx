'use client';
import { useState } from 'react';
import ClientOverview from './ClientOverview';
import ClientDocsPanelRenderer from './ClientDocsPanelRenderer';

export enum ClientDocsPanel {
    OVERVIEW = 'OVERVIEW',
    HOW_IT_WORKS = 'HOW_IT_WORKS',
    GETTING_STARTED = 'GETTING_STARTED',
    EDITING_AND_UNDERSTANDING = 'EDITING_AND_UNDERSTANDING',
    BUILDING_AND_TESTING = 'BUILDING_AND_TESTING',
    DEPLOYMENT = 'DEPLOYMENT',
    EXPORTING = 'EXPORTING'
}

const contents = [
    {
        title: 'CONTENTS',
        type: ClientDocsPanel.OVERVIEW
    },
    {
        title: 'Overview',
        type: ClientDocsPanel.OVERVIEW
    },
    {
        title: 'How it works',
        type: ClientDocsPanel.HOW_IT_WORKS
    },
    {
        title: 'Getting Started',
        type: ClientDocsPanel.GETTING_STARTED
    },
    {
        title: 'Editing & Understanding',
        type: ClientDocsPanel.EDITING_AND_UNDERSTANDING
    },
    {
        title: 'Building & Testing',
        type: ClientDocsPanel.BUILDING_AND_TESTING
    },
    {
        title: 'Deployment',
        type: ClientDocsPanel.DEPLOYMENT
    },
    {
        title: 'Exporting',
        type: ClientDocsPanel.EXPORTING
    }
];





export default function ClientDocs() {
    const [activeIndex, setActiveIndex] = useState<number>(1);
    const [clientPanel, setClientPanel] = useState<ClientDocsPanel>(ClientDocsPanel.OVERVIEW);



    function calculatePosition(index: number) {
        return index * 33.5;
    };

    function switchPanel(index: number, clientPanel: ClientDocsPanel) {
        setActiveIndex(index)
        setClientPanel(clientPanel);
    }

    return (
        <div className="relative min-h-screen w-full grid grid-cols-[80%_20%]">
            <div className='w-full'>
                <ClientDocsPanelRenderer clientPanel={clientPanel} />
            </div>
            <div className='min-h-screen'>
                <div className="flex fixed flex-col  gap-y-4 text-left text-xs tracking-wide text-light/70 mt-22">
                    <div
                        className="absolute -left-4 top-4 h-3 w-[2px] rounded-full bg-white shadow-[0_0_12px_3px_rgba(255,255,255,0.9)] transition-all duration-500 ease-out"
                        style={{
                            top: `${calculatePosition(activeIndex)}px`,
                        }}
                    />

                    {contents.map((content, index) => (
                        <span
                            key={content.type}
                            onClick={() => switchPanel(index, content.type)}
                            className={`tracking-wider select-none relative transition-colors duration-300 cursor-pointer text-[13px]
                                ${index === 0 ? 'text-white/60 cursor-default select-none' : activeIndex === index ? 'text-white' : 'hover:text-white'}
                                `}
                        >
                            {content.title}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
