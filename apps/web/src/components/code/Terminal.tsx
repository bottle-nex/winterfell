'use client';
import { useState, useEffect, useRef } from 'react';
import { MdTerminal } from 'react-icons/md';
import { Button } from '../ui/button';
import { COMMAND, CommandResponse } from './TerminalCommands';
import { useCodeEditor } from '@/src/store/code/useCodeEditor';
import { useParams } from 'next/navigation';
import executeCommandServer from '@/src/lib/server/execute-command-server';
import { useUserSessionStore } from '@/src/store/user/useUserSessionStore';
import { useCommandHistoryStore } from '@/src/store/user/useCommandHistoryStore';
import useShortcuts from '@/src/hooks/useShortcut';
import ToolTipComponent from '../ui/TooltipComponent';
import { PiBroomFill } from 'react-icons/pi';
import { BiPlus } from 'react-icons/bi';
import { IoIosClose } from 'react-icons/io';

interface Line {
    type: 'command' | 'output';
    text: string;
}

export default function Terminal() {
    const [showTerminal, setShowTerminal] = useState(false);
    const [height, setHeight] = useState(220);
    const [isResizing, setIsResizing] = useState(false);
    const [logs, setLogs] = useState<Line[]>([]);
    const [input, setInput] = useState('');

    const outputRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const { currentFile } = useCodeEditor();
    const params = useParams();
    const contractId = params.contractId as string;
    const { session } = useUserSessionStore();
    const { addCommand, moveUp, moveDown, resetIndex } = useCommandHistoryStore();

    const Prompt = () => (
        <span className="text-green-500 select-none">
            ➜ <span className="text-blue-400">~</span>
        </span>
    );

    useEffect(() => {
        if (showTerminal) inputRef.current?.focus();
    }, [showTerminal]);

    useEffect(() => {
        outputRef.current?.scrollTo({
            top: outputRef.current.scrollHeight,
            behavior: 'smooth',
        });
    }, [logs, input]);

    useShortcuts({
        'meta+k': () => setShowTerminal((prev) => !prev),
        'ctrl+k': () => setShowTerminal((prev) => !prev),
    });

    useEffect(() => {
        const doResize = (e: MouseEvent) => {
            if (!isResizing) return;
            const newHeight = window.innerHeight - e.clientY;
            if (newHeight < 50) {
                setShowTerminal(false);
                setIsResizing(false);
                return;
            }
            if (newHeight > 100 && newHeight < 600) setHeight(newHeight);
        };
        const stopResize = () => setIsResizing(false);

        if (isResizing) {
            window.addEventListener('mousemove', doResize);
            window.addEventListener('mouseup', stopResize);
        }

        return () => {
            window.removeEventListener('mousemove', doResize);
            window.removeEventListener('mouseup', stopResize);
        };
    }, [isResizing]);

    const handleCommand = (command: string) => {
        if (!session || !session.user?.token) return null;
        const trimmed = command.trim() as COMMAND;
        if (!trimmed) return;

        addCommand(trimmed);
        let output = '';

        switch (trimmed) {
            case COMMAND.CLEAR:
                setLogs([]);
                return;

            case COMMAND.HELP:
            case COMMAND.HOT_KEYS:
            case COMMAND.PLATFORM:
            case COMMAND.COMMANDS:
                output = CommandResponse[trimmed];
                break;

            case COMMAND.WINTERFELL_BUILD:
                output = CommandResponse[trimmed];
                executeCommandServer('WINTERFELL_BUILD', contractId, session.user.token);
                break;

            case COMMAND.WINTERFELL_TEST:
                output = CommandResponse[trimmed];
                executeCommandServer('WINTERFELL_TEST', contractId, session.user.token);
                break;

            case COMMAND.WINTERFELL_DEPLOY_DEVNET:
                output = CommandResponse[trimmed];
                executeCommandServer('WINTERFELL_DEPLOY_DEVNET', contractId, session.user.token);
                break;

            default:
                output = `winterfell: command not found: ${trimmed}. Try --help`;
                break;
        }

        setLogs((prev) => [
            ...prev,
            { type: 'command', text: trimmed },
            { type: 'output', text: output },
        ]);
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleCommand(input);
            setInput('');
            resetIndex();
        }

        if (e.key === 'ArrowUp') {
            e.preventDefault();
            const prevCommand = moveUp();
            if (prevCommand !== null) setInput(prevCommand);
        }

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            const nextCommand = moveDown();
            setInput(nextCommand ?? '');
        }
    };

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
            case 'gitignore':
            case 'prettierignore':
                return 'Ignore';
            default:
                return 'File';
        }
    };

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

    return (
        <>
            {showTerminal && (
                <div
                    className="absolute bottom-6 left-0 w-full bg-dark-base border-t border-neutral-800 overflow-hidden text-[11px] text-neutral-200 font-mono shadow-lg flex flex-col z-[99999]"
                    style={{ height }}
                >
                    <div
                        onMouseDown={(e) => {
                            e.preventDefault();
                            setIsResizing(true);
                        }}
                        className="cursor-ns-resize text-light/50 py-1 px-4 flex justify-between items-center select-none"
                    >
                        <Button
                            disabled
                            className="tracking-[2px] p-0 text-[11px] h-fit w-fit bg-transparent font-sans text-light/90 rounded-none"
                        >
                            TERMINAL
                        </Button>

                        <div className="absolute right-2 top-1.5 flex gap-x-1 items-center">
                            <ToolTipComponent content="clear">
                                <Button
                                    onClick={() => setLogs([])}
                                    className="h-fit w-0 bg-transparent hover:bg-dark p-0.5 rounded cursor-pointer"
                                >
                                    <PiBroomFill className="size-3 text-light/70" />
                                </Button>
                            </ToolTipComponent>

                            <ToolTipComponent content="add new tab">
                                <Button className="h-fit w-0 bg-transparent hover:bg-dark p-0.5 rounded cursor-pointer">
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

                    <div
                        ref={outputRef}
                        onClick={() => inputRef.current?.focus()}
                        className="h-full overflow-y-auto px-3 py-2 mt-1 text-light/80 flex flex-col group"
                    >
                        {renderLines(logs)}

                        <div className="flex mt-1">
                            <Prompt />
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleInputKeyDown}
                                className="outline-none text-light/80 caret-green-400 ml-2 flex-1"
                                placeholder="type a command or use --help"
                            />
                        </div>
                    </div>
                </div>
            )}

            <div className="absolute bottom-0 w-full h-6 flex justify-between items-center px-3 text-[11px] text-light/70 bg-dark-base border-t border-neutral-800 z-20">
                <div className="flex items-center space-x-3">
                    <div
                        className="flex items-center space-x-1.5 hover:bg-neutral-800/50 px-2 py-[2px] rounded-md cursor-pointer transition text-[11px]"
                        onClick={() => setShowTerminal((prev) => !prev)}
                    >
                        <span className="font-bold text-light/50 tracking-wider">Ctrl/Cmd + K</span>
                        <span className="text-light/50 flex items-center space-x-1 tracking-widest">
                            <span>to toggle</span>
                            <MdTerminal className="size-4" />
                        </span>
                    </div>
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
