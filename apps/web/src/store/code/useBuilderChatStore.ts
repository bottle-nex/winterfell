import { Message } from '@/src/types/prisma-types';
import { create } from 'zustand';

interface BuilderChatState {
    messages: Message[];
    phase: string;
    loading: boolean;
    currentFileEditing: string | null;

    setCurrentFileEditing: (file: string | null) => void;
    setLoading: (loading: boolean) => void;
    setPhase: (phase: string) => void;
    setMessage: (message: Message) => void;
    upsertMessage: (message: Partial<Message> & { id: string }) => void;
    cleanStore: () => void;
}

export const useBuilderChatStore = create<BuilderChatState>((set, get) => ({
    messages: [],
    phase: '',
    loading: false,
    currentFileEditing: null,

    setCurrentFileEditing: (file) => set({ currentFileEditing: file }),
    setLoading: (loading) => set({ loading }),
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

        let updatedMessages: Message[];

        if (existingIndex !== -1) {
            // Update existing message
            updatedMessages = messages.map((msg) => {
                if (msg.id === message.id) {
                    return { ...msg, ...message };
                }
                return msg;
            });
        } else {
            // Add new message
            updatedMessages = [...messages, message as Message];
        }

        // Sort by createdAt to maintain chronological order
        updatedMessages.sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return dateA - dateB;
        });

        set({ messages: updatedMessages });
    },
    cleanStore: () => {
        set({
            messages: [],
            phase: '',
        });
    },
}));
