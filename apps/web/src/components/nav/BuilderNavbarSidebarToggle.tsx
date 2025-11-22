'use client';
import {
    TbLayoutSidebarLeftCollapseFilled,
    TbLayoutSidebarRightCollapseFilled,
    TbMessageFilled,
} from 'react-icons/tb';
import ToolTipComponent from '../ui/TooltipComponent';
import { cn } from '@/src/lib/utils';
import { useCodeEditor } from '@/src/store/code/useCodeEditor';

export default function BuilderNavbarSidebarToggle() {
    const { setCollapsechat, collapseChat } = useCodeEditor();
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const shortcutKey = isMac ? 'Cmd' : 'Ctrl';

    const iconBaseStyles = "cursor-pointer transition-transform hover:-translate-y-[0.5px]";

    const chatButtonBaseStyles = "flex items-center justify-center gap-x-1 rounded-[4px] border px-3 py-0.5 text-xs cursor-pointer";
    const chatButtonActiveStyles = "border-light/70 text-light/70";
    const chatButtonInactiveStyles = "border-light/50 text-light/50";

    return (
        <div className="flex items-center justify-center gap-x-1.5">
            <ToolTipComponent duration={300} content={`collapse | ${shortcutKey} + E`}>
                <div
                    onClick={() => setCollapsechat(!collapseChat)}
                    className={cn(
                        chatButtonBaseStyles,
                        collapseChat ? chatButtonInactiveStyles : chatButtonActiveStyles
                    )}
                >
                    <span>collapse chat</span>
                    <TbMessageFilled
                        size={15}
                        className={cn(
                            iconBaseStyles,
                            collapseChat ? "text-light/50" : "text-light/70"
                        )}
                    />
                </div>
            </ToolTipComponent>
        </div>
    );
}