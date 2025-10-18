import { Message } from '@repo/database';
import { create } from 'zustand';

interface BuilderChatState {
    messages: Message[];
    phase: string;
    setPhase: (phase: string) => void;
    setMessage: (message: Message) => void;
    upsertMessage: (message: Partial<Message> & { id: string }) => void;
    cleanStore: () => void;
}

export const useBuilderChatStore = create<BuilderChatState>((set, get) => ({
    messages: [],
    phase: '',
    setPhase: (phase) => set({ phase }),
    setMessage: (message) => {
        const messages = get().messages;
        set({
            messages: [...messages, message],
        });
    },
    upsertMessage: (message: Partial<Message> & { id: string }) => {
        const messages = get().messages;
        const existingIndex = messages.findIndex((msg) => msg.id === message.id);

        if (existingIndex !== -1) {
            set({
                messages: messages.map((msg) => {
                    if (msg.id === message.id) {
                        return { ...msg, ...message };
                    }
                    return msg;
                }),
            });
        } else {
            set({
                messages: [...messages, message as Message],
            });
        }
    },
    cleanStore: () => {
        set({
            messages: [],
            phase: '',
        });
    },
}));
