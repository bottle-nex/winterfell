'use client';
import {
    TbLayoutSidebarLeftCollapseFilled,
    TbLayoutSidebarRightCollapseFilled,
} from 'react-icons/tb';
import ToolTipComponent from '../ui/TooltipComponent';
import { cn } from '@/src/lib/utils';
import { useCodeEditor } from '@/src/store/code/useCodeEditor';

export default function BuilderNavbarSidebarToggle() {
    const { collapseFileTree, setCollapseFileTree } = useCodeEditor();
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const shortcutKey = isMac ? 'Cmd' : 'Ctrl';

    return (
        <div className="flex items-center justify-center gap-x-1.5">
            <ToolTipComponent duration={300} content={`collapse | ${shortcutKey} + E`}>
                <TbLayoutSidebarLeftCollapseFilled
                    size={22}
                    onClick={() => setCollapseFileTree(false)}
                    className={cn(
                        'text-light/70 cursor-pointer hover:-translate-y-[0.5px] transition-transform',
                        !collapseFileTree && 'text-primary',
                    )}
                />
            </ToolTipComponent>

            <ToolTipComponent duration={300} content={`expand | ${shortcutKey} + E`}>
                <TbLayoutSidebarRightCollapseFilled
                    size={22}
                    onClick={() => setCollapseFileTree(true)}
                    className={cn(
                        'text-light/70 cursor-pointer hover:-translate-y-[0.5px] transition-transform',
                        collapseFileTree && 'text-primary',
                    )}
                />
            </ToolTipComponent>
        </div>
    );
}
