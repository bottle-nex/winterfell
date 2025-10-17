import { Message } from '@repo/database';
import { create } from 'zustand';

interface BuilderChatState {
    messages: Message[];
    setMessage: (message: Message) => void;
}

export const useBuilderChatStore = create<BuilderChatState>((set, get) => ({
    messages: [],
    setMessage: (message) => {
        const messages = get().messages;
        set({
            messages: [...messages, message],
        });
    },
}));
