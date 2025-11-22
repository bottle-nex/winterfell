'use client';
import 'react-complex-tree/lib/style-modern.css';
import { useCodeEditor } from '@/src/store/code/useCodeEditor';
import { SidePanelValues } from './EditorSidePanel';
import GithubPanel from './GithubPanel';
import FileTree from './Filetree';
import { useSidePanelStore } from '@/src/store/code/useSidePanelStore';

export default function SidePanel() {
    const { currentState } = useSidePanelStore();
    const { collapseFileTree } = useCodeEditor();

    if (!collapseFileTree) return null;

    function renderSidePanels() {
        switch (currentState) {
            case SidePanelValues.FILE:
                return <FileTree />;
            case SidePanelValues.GITHUB:
                return <GithubPanel />;
            default:
                return <div></div>;
        }
    }

    return (
        <div className="flex max-h-full bg-[#16171a] text-neutral-200 border-r border-neutral-800 min-w-[15rem] max-w-[18rem] ">
            <div className="flex-1 flex-col h-full select-none ">
                <div className="w-full h-full ">
                    {renderSidePanels()}
                </div>
            </div>
        </div>
    );

}
