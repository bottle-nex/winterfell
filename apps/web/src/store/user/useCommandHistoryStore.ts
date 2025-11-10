import { create } from 'zustand';

interface CommandHistoryStore {
    commands: string[];
    addCommand: (command: string) => void;
    moveUp: () => string | null;
    moveDown: () => string | null;
    index: number;
    resetIndex: () => void;
}

export const useCommandHistoryStore = create<CommandHistoryStore>((set, get) => ({
    commands: [],
    index: -1,

    addCommand: (command) =>
        set((state) => ({
            commands: [command, ...state.commands].slice(0, 10),
            index: -1,
        })),

    moveUp: () => {
        const { commands, index } = get();
        if (commands.length === 0) return null;
        const newIndex = Math.min(index + 1, commands.length - 1);
        set({ index: newIndex });
        return commands[newIndex];
    },

    moveDown: () => {
        const { commands, index } = get();
        if (commands.length === 0) return null;
        const newIndex = Math.max(index - 1, -1);
        set({ index: newIndex });
        return commands[newIndex];
    },

    resetIndex: () => set({ index: -1 }),
}));
