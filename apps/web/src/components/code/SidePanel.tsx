'use client';
import 'react-complex-tree/lib/style-modern.css';
import { useCodeEditor } from '@/src/store/code/useCodeEditor';
import EditorSidePanel, { sidePanelValues } from './EditorSidePanel';
import { useState } from 'react';
import GithubPanel from './GithubPanel';
import FileTree from './Filetree';

export default function SidePanel() {
    const [sidePanelRenderer, setSidePanelRenderer] = useState<sidePanelValues>(sidePanelValues.FILE);
    const { collapseFileTree } = useCodeEditor();

    if (!collapseFileTree) return null;

    function renderSidePanels() {
        switch (sidePanelRenderer) {
            case sidePanelValues.FILE:
                return <FileTree />;
            case sidePanelValues.GITHUB:
                return <GithubPanel />;
            default:
                return <div></div>
        }
    }

    return (
        <div className="flex h-full bg-[#16171a] text-neutral-200 border-r border-neutral-800 w-[18rem]">
            <EditorSidePanel setSidePanelRenderer={setSidePanelRenderer} />
            <div className='flex-1 flex-col'>
                <div className="p-3 border-b border-neutral-800 flex-shrink-0">
                    <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                        Project Files
                    </h2>
                </div>
                <div className="w-full flex-1 overflow-y-auto">
                    {renderSidePanels()}
                </div>
            </div>
        </div>
    );
}
