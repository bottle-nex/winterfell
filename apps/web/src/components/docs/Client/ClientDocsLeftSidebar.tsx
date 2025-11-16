import { contents } from '@/src/const/docsSidebarValues';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { ClientDocsPanel } from '@/src/types/docs-types';
import { cn } from '@/src/lib/utils';
import AppLogo from '../../tickers/AppLogo';
import { Input } from '../../ui/input';
import { HiMiniMagnifyingGlass } from 'react-icons/hi2';
import { useActiveContentStore } from '@/src/store/docs/useActiveContentStore';
import { IoMdArrowForward } from 'react-icons/io';

interface ClientDocsSidebarProps {
    switchPanel: (index: number, panel: ClientDocsPanel) => void;
}

export default function ClientDocsLeftSidebar({ switchPanel }: ClientDocsSidebarProps) {
    const [_activeIndex, setActiveIndex] = useState<number>(1);
    const { activeContent, setActiveContent } = useActiveContentStore();
    const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set());

    function toggleSection(index: number): void {
        const newExpanded = new Set(expandedSections);
        if (newExpanded.has(index)) {
            newExpanded.delete(index);
        } else {
            newExpanded.add(index);
        }
        setExpandedSections(newExpanded);
    }

    function handlePanelSwitch(index: number, panel: ClientDocsPanel): void {
        setActiveIndex(index);
        setActiveContent(panel);
        switchPanel(index, panel);
    }

    return (
        <div className="min-h-screen z-50 bg-dark border-l border-neutral-800 fixed top-0 left-0 w-[20vw] flex flex-col justify-between">
            <div className='px-8 py-6'>
                <div className="relative">
                    <AppLogo />
                </div>
                <div className="relative mt-4">
                    <HiMiniMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-light/70" />
                    <Input
                        className="border border-neutral-800 bg-dark-base/60 py-4.5 pl-9  focus:border-transparent focus:ring-0 focus:outline-none"
                        placeholder="Search..."
                    />
                </div>
                <div className="flex flex-col gap-y-1 text-left tracking-wide text-light/70 mt-8 w-full relative">
                    {contents.map((content, index) => {
                        const hasChildren = content.children && content.children.length > 0;
                        const isExpanded = expandedSections.has(index);
                        const isActive = activeContent === content.type;
                        const Icon = content.icon;

                        return (
                            <div
                                onClick={() => handlePanelSwitch(index, content.type)}
                                className={cn(
                                    isActive && 'bg-black/20',
                                    'px-4 py-2.5 rounded-lg w-full cursor-pointer relative',
                                )}
                                key={content.type}
                            >
                                {isActive && index !== 2 && (
                                    <div className="absolute h-3 w-0.5 flex top-1/3 left-0 rounded-full bg-primary shadow-[0_1px_8px_2px_rgba(108,68,252,0.8)] transition-all duration-500 ease-out" />
                                )}

                                {isActive && (
                                    <div className="absolute h-3 w-0.5 flex top-3 left-0 rounded-full bg-primary shadow-[0_1px_8px_2px_rgba(108,68,252,0.8)] transition-all duration-500 ease-out" />
                                )}

                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2.5">
                                        {Icon && (
                                            <Icon
                                                className={cn(
                                                    'transition-colors duration-300',
                                                    isActive ? 'text-primary-light' : 'text-white/50',
                                                )}
                                                size={16}
                                            />
                                        )}
                                        <span
                                            className={`tracking-wider select-none relative transition-colors duration-300 text-[13px] text-light
                                            ${isActive ? 'text-primary-light' : 'hover:text-light'}
                                        `}
                                        >
                                            {content.title}
                                        </span>
                                    </div>
                                    {hasChildren && (
                                        <div
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleSection(index);
                                            }}
                                            className="cursor-pointer text-white/50 hover:text-white transition-colors p-0 bg-transparent border-0"
                                        >
                                            {isExpanded ? (
                                                <ChevronDown size={14} />
                                            ) : (
                                                <ChevronRight size={14} />
                                            )}
                                        </div>
                                    )}
                                </div>

                                {hasChildren && isExpanded && content.children ? (
                                    <div className="ml-2 mt-2 flex flex-col gap-y-2">
                                        {content.children.map((child) => {
                                            const isChildActive = activeContent === child.type;
                                            const ChildIcon = child.icon;
                                            return (
                                                <div
                                                    key={child.type}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handlePanelSwitch(index, child.type);
                                                    }}
                                                    className={cn(
                                                        'tracking-wider select-none transition-colors duration-300 cursor-pointer px-4 py-2.5 rounded-[4px] flex items-center gap-2 text-[13px]',
                                                        isChildActive
                                                            ? 'text-white bg-black/20'
                                                            : 'hover:text-white text-white/70',
                                                    )}
                                                >
                                                    {ChildIcon && (
                                                        <ChildIcon
                                                            className={cn(
                                                                'transition-colors duration-300',
                                                                isChildActive
                                                                    ? 'text-white'
                                                                    : 'text-white/50',
                                                            )}
                                                            size={14}
                                                        />
                                                    )}
                                                    <span>{child.title}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : null}
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="border-t border-neutral-800 px-4 py-3 space-y-1.5">
                <button className="flex items-center gap-x-2 cursor-pointer group">
                    <span className="text-light group-hover:text-primary transition-colors">
                        Explore playground
                    </span>
                    <IoMdArrowForward className="-rotate-45 text-primary" />
                </button>

                <div className="text-[13px] text-light/40 leading-none text-left">
                    winterfell.dev
                </div>
            </div>

        </div>
    );
}
