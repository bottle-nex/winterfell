'use client';

import { useState, useEffect, useRef } from 'react';
import { MdTerminal } from 'react-icons/md';
import { Button } from '../ui/button';

enum TerminalTabOptions {
    SHELL = 'shell',
    HELP = 'help',
}

interface Line {
    type: 'command' | 'output';
    text: string;
}

export default function StatusBar() {
    const [showTerminal, setShowTerminal] = useState<boolean>(false);
    const [height, setHeight] = useState<number>(220);
    const [isResizing, setIsResizing] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<TerminalTabOptions>(TerminalTabOptions.SHELL);
    const [logs, setLogs] = useState<Line[]>([]);
    const [helpLogs, setHelpLogs] = useState<Line[]>([]);
    const [input, setInput] = useState<string>('');
    const outputRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const Prompt = () => (
        <span className="text-green-500 select-none">
            ➜ <span className="text-blue-400">~</span>
        </span>
    );

    useEffect(() => {
        inputRef.current?.focus();
    }, [showTerminal, activeTab]);

    useEffect(() => {
        outputRef.current?.scrollTo({
            top: outputRef.current.scrollHeight,
            behavior: 'smooth',
        });
    }, [logs, helpLogs, input]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const isMac = navigator.platform.toUpperCase().includes('MAC');
            const toggleKey = isMac
                ? e.metaKey && e.key.toLowerCase() === 'k'
                : e.ctrlKey && e.key.toLowerCase() === 'k';
            const switchTabKey = isMac
                ? e.metaKey && e.key.toLowerCase() === 's'
                : e.ctrlKey && e.key.toLowerCase() === 's';

            if (toggleKey) {
                e.preventDefault();
                setShowTerminal((prev) => !prev);
            }

            if (switchTabKey && showTerminal) {
                e.preventDefault();
                setActiveTab((prev) =>
                    prev === TerminalTabOptions.SHELL
                        ? TerminalTabOptions.HELP
                        : TerminalTabOptions.SHELL,
                );
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [showTerminal]);

    // Resize terminal
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

    // Handle commands
    const handleCommand = (command: string) => {
        const trimmed = command.trim();
        if (!trimmed) return;

        let output = '';
        switch (trimmed) {
            case 'clear':
                if (activeTab === TerminalTabOptions.SHELL) setLogs([]);
                else setHelpLogs([]);
                return;
            case '--help':
                output = `
AVAILABLE COMMANDS:
clear              Clear the terminal
--help             Show available commands
--commands         Show winterfell commands
--platform         Show platform details
--hotkeys          Show hot keys/ shortcuts
`;
                break;
            case '--hotkeys':
                output = `
HOT KEYS:
Ctrl/ Cmd + S          Switch Terminal Tabs
Ctrl/ Cmd + K          Toggle shell`;
                break;
            case '--platform':
                output = `
PLATFORM DETAILS:
portal              Winterfell
version             1.0.0
shell               winterfell`;
                break;

            case '--commands':
                output = `
WINTERFELL SHELL COMMANDS:
winterfell build                to build the contract
winterfell test                 to run the test file


PREMIUM FEATURES:
winterfell deploy --devnet      to deploy the contract on devnet
winterfell deploy --mainnet     to deploy the contract on mainnet`
                break;

            default:
                output = `winterfell: command not found: ${trimmed}. Try --help`;
                break;
        }

        const targetLogs = activeTab === TerminalTabOptions.SHELL ? logs : helpLogs;
        const setTargetLogs = activeTab === TerminalTabOptions.SHELL ? setLogs : setHelpLogs;

        setTargetLogs([
            ...targetLogs,
            { type: 'command', text: trimmed },
            { type: 'output', text: output },
        ]);
    };

    const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleCommand(input);
            setInput('');
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

    const activeLogs = activeTab === TerminalTabOptions.SHELL ? logs : helpLogs;

    return (
        <>
            {showTerminal && (
                <div
                    className="absolute bottom-6 left-0 w-full bg-dark-base border-t border-neutral-800 text-[11px] text-neutral-200 z-10 font-mono flex flex-col"
                    style={{ height }}
                >
                    {/* Tabs */}
                    <div
                        onMouseDown={(e) => {
                            e.preventDefault();
                            setIsResizing(true);
                        }}
                        className="cursor-ns-resize bg-dark-base text-light/50 py-1 px-4 border-b border-neutral-800 flex space-x-3 select-none"
                    >
                        <Button
                            onClick={() => setActiveTab(TerminalTabOptions.SHELL)}
                            className={`tracking-[2px] py-0 px-1 rounded-none bg-transparent hover:bg-transparent h-fit w-fit text-[11px] cursor-pointer ${
                                activeTab === TerminalTabOptions.SHELL
                                    ? 'text-light/70 border-b border-light/70'
                                    : 'text-light/50'
                            }`}
                        >
                            SHELL
                        </Button>
                        <Button
                            onClick={() => setActiveTab(TerminalTabOptions.HELP)}
                            className={`tracking-[2px] py-0 px-1 text-[11px] h-fit w-fit bg-transparent hover:bg-transparent rounded-none cursor-pointer ${
                                activeTab === TerminalTabOptions.HELP
                                    ? 'text-light/70 border-b border-light/70'
                                    : 'text-light/50'
                            }`}
                        >
                            ACTIONS
                        </Button>
                    </div>

                    <div
                        ref={outputRef}
                        className="flex-1 overflow-y-auto px-3 py-2 text-light/80 flex flex-col"
                    >
                        {renderLines(activeLogs)}

                        <div className="flex mt-1">
                            <Prompt />
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleEnter}
                                className="bg-transparent outline-none flex-1 text-light/80 caret-green-400 ml-2"
                                placeholder="type a command or use --help"
                                autoFocus
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
                        TypeScript
                    </div>
                </div>
            </div>
        </>
    );
}
