import { create } from 'zustand';

interface TerminalLogStore {
    logs: string[];
    addLog: (log: string) => void;
    setLogs: (logs: string[]) => void;
}

export const useTerminalLogStore = create<TerminalLogStore>((set, get) => ({
    logs: [],
    addLog: (log: string) => set({ logs: [...get().logs, log] }),
    setLogs: (logs: string[]) => set({ logs }),
}));
