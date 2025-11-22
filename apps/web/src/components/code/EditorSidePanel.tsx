import { LuFile } from 'react-icons/lu';
import { PiGithubLogoFill } from 'react-icons/pi';
import ToolTipComponent from '../ui/TooltipComponent';
import { Dispatch, SetStateAction } from 'react';
import { useCodeEditor } from '@/src/store/code/useCodeEditor';
import { useSidePanelStore } from '@/src/store/code/useSidePanelStore';
import { cn } from '@/src/lib/utils';

export enum SidePanelValues {
    FILE = 'FILE',
    GITHUB = 'GITHUB',
}

const sidePanelData = [
    {
        icon: <LuFile size={20} />,
        value: SidePanelValues.FILE,
        tooltip: 'Files',
    },
    {
        icon: <PiGithubLogoFill size={21} />,
        value: SidePanelValues.GITHUB,
        tooltip: 'GitHub Repository',
    },
];

interface EditorSidePanel {
    setSidePanelRenderer: Dispatch<SetStateAction<SidePanelValues>> | ((value: SidePanelValues | null) => void);
}

export default function EditorSidePanel() {
    const { collapseFileTree, setCollapseFileTree } = useCodeEditor();
    const { setCurrentState } = useSidePanelStore();
    const { currentState } = useSidePanelStore();

    function handleToggleSidebar(value: SidePanelValues) {

        if(collapseFileTree) {
            value === currentState ? setCollapseFileTree(false) : setCurrentState(value);
        } else {
            setCollapseFileTree(true);
            setCurrentState(value);
        }
    }

    return (
        <div className="h-full min-w-14 bg-dark-base border-neutral-800 border-r">
            <div className="flex flex-col gap-y-7 items-center py-5">
                {sidePanelData.map((item) => (
                    <ToolTipComponent side="right" key={item.value} content={item.tooltip}>
                        <div
                            onClick={() => handleToggleSidebar(item.value)}
                            className={cn(
                                "cursor-pointer text-light/70 hover:text-primary/70 transition-colors",
                                currentState && currentState === item.value ? 'text-primary/70' : 'text-light/70'
                            )}
                        >
                            {item.icon}
                        </div>
                    </ToolTipComponent>
                ))}
            </div>
        </div>
    );
}
