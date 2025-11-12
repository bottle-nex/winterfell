'use client';
import { useState, useEffect, useRef } from 'react';
import { MdDelete, MdTerminal } from 'react-icons/md';
import { useCodeEditor } from '@/src/store/code/useCodeEditor';
import { useParams } from 'next/navigation';
import { useUserSessionStore } from '@/src/store/user/useUserSessionStore';
import { useCommandHistoryStore } from '@/src/store/user/useCommandHistoryStore';
import useShortcuts from '@/src/hooks/useShortcut';
import { PiBroomFill, PiTerminal, PiTerminalWindow } from 'react-icons/pi';
import { BiPlus } from 'react-icons/bi';
import { IoIosClose } from 'react-icons/io';
import { Button } from '../ui/button';
import ToolTipComponent from '../ui/TooltipComponent';
import { useTerminalResize } from '@/src/hooks/useTerminalResize';
import { useTerminalLogic } from '@/src/hooks/useTerminal';
import { Line } from '@/src/types/terminal_types';

export default function Terminal() {
    const [showTerminal, setShowTerminal] = useState<boolean>(false);
    const outputRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const { currentFile } = useCodeEditor();
    const params = useParams();
    const contractId = params.contractId as string;
    const { session } = useUserSessionStore();
    const { addCommand, moveUp, moveDown, resetIndex } = useCommandHistoryStore();
    const { height, startResize } = useTerminalResize({
        onClose: () => setShowTerminal(false),
    });
    const {
        terminals,
        activeTab,
        currentTerminal,
        setActiveTab,
        handleCommand,
        updateInput,
        updateLogs,
        addNewTerminal,
        deleteTerminal,
    } = useTerminalLogic({
        contractId,
        token: session?.user?.token,
        addCommand,
    });

    useShortcuts({
        'meta+j': () => setShowTerminal((prev) => !prev),
        'ctrl+j': () => setShowTerminal((prev) => !prev),
        'ctrl+shift+~': () => addNewTerminal(),
        'ctrl+shift+d': () => deleteTerminal(currentTerminal.id),
    });

    const Prompt = () => (
        <span className="text-green-500 select-none">
            ➜ <span className="text-blue-400">~</span>
        </span>
    );

    useEffect(() => {
        if (showTerminal) inputRef.current?.focus();
    }, [showTerminal, activeTab]);

    useEffect(() => {
        outputRef.current?.scrollTo({
            top: outputRef.current.scrollHeight,
            behavior: 'smooth',
        });
    }, [currentTerminal?.logs]);

    function handleInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleCommand(currentTerminal.input);
            updateInput(activeTab, '');
            resetIndex();
        }
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            const prevCommand = moveUp();
            if (prevCommand !== null) updateInput(activeTab, prevCommand);
        }
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            const nextCommand = moveDown();
            updateInput(activeTab, nextCommand ?? '');
        }
    }

    const renderLines = (lines: Line[]) =>
        lines.map((line, i) => (
            <div key={i} className="whitespace-pre-wrap text-left">
                {line.type === 'command' ? (
                    <>
                        <Prompt /> <span className="ml-2">{line.text}</span>
                    </>
                ) : (
                    <span className="ml-6">{line.text}</span>
                )}
            </div>
        ));

    const handleCurrentFileExtension = () => {
        if (!currentFile) return 'no selected file.';
        const extension = currentFile.name.split('.')[1];
        switch (extension) {
            case 'rs':
                return 'Rust';
            case 'ts':
                return 'TypeScript';
            case 'json':
                return 'JSON';
            case 'toml':
                return 'TOML';
            default:
                return 'File';
        }
    };

    return (
        <>
            {showTerminal && (
                <div
                    className="absolute bottom-6 left-0 right-0 bg-dark-base border-t border-neutral-800 text-[11px] text-neutral-200 font-mono shadow-lg flex flex-col z-[999999]"
                    style={{
                        height: `min(${height}px, calc(100% - 6rem))`,
                        maxHeight: 'calc(100% - 6rem)',
                    }}
                >
                    <div
                        onMouseDown={(e) => {
                            e.preventDefault();
                            startResize();
                        }}
                        className="h-[2px] w-full cursor-ns-resize bg-neutral-800 hover:bg-blue-500/20 active:bg-blue-500/40 transition-colors flex-shrink-0"
                    />
                    <div className="text-light/50 py-1 px-4 flex justify-between items-center select-none bg-dark-base flex-shrink-0">
                        <Button
                            disabled
                            className="tracking-[2px] p-0 text-[11px] h-fit w-fit bg-transparent font-sans text-light/90 rounded-none"
                        >
                            TERMINAL
                        </Button>
                        <div className="flex gap-x-1 items-center">
                            <Button className="h-fit w-auto bg-transparent hover:bg-dark p-0 rounded cursor-pointer text-light/60 items-center">
                                <PiTerminal className="size-4" />
                                <span className="text-xs font-sans tracking-wide leading-0">
                                    winter
                                </span>
                            </Button>
                            <ToolTipComponent content="kill terminal">
                                <Button
                                    onClick={() => deleteTerminal(activeTab)}
                                    className="h-fit w-0 bg-transparent hover:bg-dark p-0.5 rounded cursor-pointer"
                                >
                                    <MdDelete className="size-4 text-light/60" />
                                </Button>
                            </ToolTipComponent>
                            <ToolTipComponent content="clear">
                                <Button
                                    onClick={() => updateLogs(activeTab, [])}
                                    className="h-fit w-0 bg-transparent hover:bg-dark p-0.5 rounded cursor-pointer"
                                >
                                    <PiBroomFill className="size-3 text-light/70" />
                                </Button>
                            </ToolTipComponent>
                            <ToolTipComponent content="add new tab">
                                <Button
                                    onClick={addNewTerminal}
                                    className="h-fit w-0 bg-transparent hover:bg-dark p-0.5 rounded cursor-pointer"
                                >
                                    <BiPlus className="size-4 text-light/70" />
                                </Button>
                            </ToolTipComponent>
                            <ToolTipComponent content="close">
                                <Button
                                    onClick={() => setShowTerminal(false)}
                                    className="h-fit w-0 bg-transparent hover:bg-dark p-0.5 rounded cursor-pointer"
                                >
                                    <IoIosClose className="size-5 text-light/70" />
                                </Button>
                            </ToolTipComponent>
                        </div>
                    </div>
                    <div className="flex flex-1 min-h-0 overflow-hidden">
                        <div
                            ref={outputRef}
                            onClick={() => inputRef.current?.focus()}
                            className="flex-1 cursor-text overflow-y-auto px-3 py-2 text-light/80 flex flex-col"
                        >
                            {renderLines(currentTerminal.logs)}
                            <div className="flex mt-1">
                                <Prompt />
                                <input
                                    aria-label="terminal"
                                    ref={inputRef}
                                    type="text"
                                    value={currentTerminal.input}
                                    onChange={(e) => updateInput(activeTab, e.target.value)}
                                    onKeyDown={handleInputKeyDown}
                                    className="outline-none bg-transparent text-light/80 caret-green-400 ml-2 flex-1"
                                />
                            </div>
                        </div>

                        <div className="w- border-l border-neutral-800 px-1 flex flex-col items-center py-2 overflow-y-auto flex-shrink-0">
                            {terminals.map((tab) => (
                                <ToolTipComponent key={tab.id} content={tab.name}>
                                    <Button
                                        // variant='ghost'
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`h-fit !px-1.5 bg-transparent py-1 hover:bg-dark rounded-none cursor-pointer ${
                                            activeTab === tab.id ? 'bg-dark' : 'text-light/70'
                                        }`}
                                    >
                                        <PiTerminalWindow className="size-4" />
                                    </Button>
                                </ToolTipComponent>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 h-6 flex justify-between items-center px-3 text-[11px] text-light/70 bg-dark-base border-t border-neutral-800 z-20">
                <div
                    className="flex items-center space-x-1.5 hover:bg-neutral-800/50 px-2 py-[2px] rounded-md cursor-pointer transition text-[11px]"
                    onClick={() => setShowTerminal((prev) => !prev)}
                >
                    <span className="font-bold text-light/50 tracking-wider">Ctrl/Cmd + J</span>
                    <span className="text-light/50 flex items-center space-x-1 tracking-widest">
                        <span>to toggle</span>
                        <MdTerminal className="size-4" />
                    </span>
                </div>
                <div className="flex items-center space-x-4 text-light/60">
                    <div className="hover:text-light/80 cursor-pointer tracking-wider">
                        Ln 128, Col 14
                    </div>
                    <div className="hover:text-light/80 cursor-pointer tracking-wider">
                        {handleCurrentFileExtension()}
                    </div>
                </div>
            </div>
        </>
    );
}
