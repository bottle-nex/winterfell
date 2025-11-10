import { useState, useCallback } from 'react';
import executeCommandServer from '@/src/lib/server/execute-command-server';
import { COMMAND, CommandResponse } from '../lib/terminal_commands';
import { Line, TerminalTab } from '../types/terminal_types';

interface UseTerminalLogicProps {
    contractId: string;
    token: string | undefined | null;
    addCommand: (command: string) => void;
}

export function useTerminalLogic({ contractId, token, addCommand }: UseTerminalLogicProps) {
    const [terminals, setTerminals] = useState<TerminalTab[]>([
        { id: '1', name: 'shell 1', logs: [], input: '' },
    ]);

    const [activeTab, setActiveTab] = useState<string>('1');

    const appendLog = useCallback((tabId: string, line: Line) => {
        setTerminals((prev) =>
            prev.map((t) => (t.id === tabId ? { ...t, logs: [...t.logs, line] } : t)),
        );
    }, []);

    const updateLogs = useCallback((tabId: string, logs: Line[]) => {
        setTerminals((prev) => prev.map((t) => (t.id === tabId ? { ...t, logs } : t)));
    }, []);

    const updateInput = useCallback((tabId: string, input: string) => {
        setTerminals((prev) => prev.map((t) => (t.id === tabId ? { ...t, input } : t)));
    }, []);

    const handleCommand = useCallback(
        (command: string) => {
            if (!token) return;
            const trimmed = command.trim() as COMMAND;
            if (!trimmed) return;

            addCommand(trimmed);
            let output = '';

            switch (trimmed) {
                case COMMAND.CLEAR:
                    updateLogs(activeTab, []);
                    return;

                case COMMAND.HELP:
                case COMMAND.HOT_KEYS:
                case COMMAND.PLATFORM:
                case COMMAND.COMMANDS:
                    output = CommandResponse[trimmed];
                    break;

                case COMMAND.WINTERFELL_BUILD:
                case COMMAND.WINTERFELL_TEST:
                case COMMAND.WINTERFELL_DEPLOY_DEVNET:
                    output = CommandResponse[trimmed];
                    executeCommandServer(trimmed, contractId, token);
                    break;

                default:
                    output = `winterfell: command not found: ${trimmed}. Try --help`;
                    break;
            }

            appendLog(activeTab, { type: 'command', text: trimmed });
            appendLog(activeTab, { type: 'output', text: output });
        },
        [token, activeTab, addCommand, appendLog, updateLogs, contractId],
    );

    const addNewTerminal = useCallback(() => {
        const newId = crypto.randomUUID();
        const newTab: TerminalTab = {
            id: newId,
            name: `shell ${terminals.length + 1}`,
            logs: [],
            input: '',
        };
        setTerminals((prev) => [...prev, newTab]);
        setActiveTab(newId);
    }, [terminals.length]);

    const deleteTerminal = useCallback(
        (id: string) => {
            if (terminals.length === 1) return;
            const filtered = terminals.filter((t) => t.id !== id);
            setTerminals(filtered);
            if (activeTab === id) setActiveTab(filtered[0].id);
        },
        [terminals, activeTab],
    );

    const currentTerminal = terminals.find((t) => t.id === activeTab)!;

    return {
        terminals,
        activeTab,
        currentTerminal,
        setActiveTab,
        handleCommand,
        updateInput,
        updateLogs,
        addNewTerminal,
        deleteTerminal,
    };
}
