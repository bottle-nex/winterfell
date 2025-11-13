import { LuFile } from 'react-icons/lu';
import { PiGithubLogoFill } from 'react-icons/pi';
import ToolTipComponent from '../ui/TooltipComponent';
import { Dispatch, SetStateAction } from 'react';

export enum sidePanelValues {
    FILE = 'FILE',
    GITHUB = 'GITHUB',
}

const sidePanelData = [
    {
        icon: <LuFile size={20} />,
        value: sidePanelValues.FILE,
        tooltip: 'Files',
    },
    {
        icon: <PiGithubLogoFill size={21} />,
        value: sidePanelValues.GITHUB,
        tooltip: 'GitHub Repository',
    },
];

interface EditorSidePanel {
    setSidePanelRenderer: Dispatch<SetStateAction<sidePanelValues>>;
}

export default function EditorSidePanel({ setSidePanelRenderer }: EditorSidePanel) {
    return (
        <div className="h-full w-[3.5rem] bg-dark-base border-neutral-800 border-r">
            <div className="flex flex-col gap-y-7 items-center py-5">
                {sidePanelData.map((item) => (
                    <ToolTipComponent side="right" key={item.value} content={item.tooltip}>
                        <div
                            onClick={() => setSidePanelRenderer(item.value)}
                            className="cursor-pointer text-light/70 hover:text-primary/70 transition-colors"
                        >
                            {item.icon}
                        </div>
                    </ToolTipComponent>
                ))}
            </div>
        </div>
    );
}
