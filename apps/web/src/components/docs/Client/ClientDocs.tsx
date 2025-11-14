'use client';
import { useState } from 'react';
import ClientDocsPanelRenderer from './ClientDocsPanelRenderer';

export enum ClientDocsPanel {
    OVERVIEW = 'OVERVIEW',
    HOW_IT_WORKS = 'HOW_IT_WORKS',
    GETTING_STARTED = 'GETTING_STARTED',
    WINTERFELL_TERMINAL = 'WINTERFELL_TERMINAL',
    BUILDING_AND_TESTING = 'BUILDING_AND_TESTING',
    DEPLOYMENT = 'DEPLOYMENT',
    EXPORTING = 'EXPORTING',
    SUBSCRIPTION_PLANS = 'SUBSCRIPTION_PLANS',
}

const contents = [
    {
        title: 'CONTENTS',
        type: ClientDocsPanel.OVERVIEW,
    },
    {
        title: 'Overview',
        type: ClientDocsPanel.OVERVIEW,
    },
    {
        title: 'How it works',
        type: ClientDocsPanel.HOW_IT_WORKS,
    },
    {
        title: 'Getting Started',
        type: ClientDocsPanel.GETTING_STARTED,
    },
    {
        title: 'Winterfell Terminal',
        type: ClientDocsPanel.WINTERFELL_TERMINAL,
    },
    {
        title: 'Building & Testing',
        type: ClientDocsPanel.BUILDING_AND_TESTING,
    },
    {
        title: 'Deployment',
        type: ClientDocsPanel.DEPLOYMENT,
    },
    {
        title: 'Exporting',
        type: ClientDocsPanel.EXPORTING,
    },
    {
        title: 'Subscription Plans',
        type: ClientDocsPanel.SUBSCRIPTION_PLANS,
    },
];

export default function ClientDocs() {
    const [activeIndex, setActiveIndex] = useState<number>(1);
    const [clientPanel, setClientPanel] = useState<ClientDocsPanel>(ClientDocsPanel.OVERVIEW);

    function calculatePosition(index: number) {
        return index * 37.5;
    }

    function switchPanel(index: number, clientPanel: ClientDocsPanel) {
        if (index === 0) return;
        setActiveIndex(index);
        setClientPanel(clientPanel);
    }

    return (
        <div className="relative min-h-screen w-full grid grid-cols-[80%_20%]">
            <div className="w-full">
                <ClientDocsPanelRenderer clientPanel={clientPanel} />
            </div>
            <div className="min-h-screen z-50 bg-dark-base">
                <div className="flex fixed flex-col gap-y-5 text-left text-xs tracking-wide text-light/70 mt-22">
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
