import { create } from 'zustand';

export interface Message {
    id: string;
    chatId: string;
    role: 'USER' | 'AI';
    content: string;
    createdAt: Date;
    isStreaming?: boolean;
}

export interface Chat {
    id: string;
    userId: string;
    contractId: string;
    messages: Message[];
    createdAt: Date;
    updatedAt: Date;
}

interface ChatState {
    currentChatId: string | null;
    chats: Map<string, Chat>;
    isStreaming: boolean;
    streamingMessageId: string | null;
    error: string | null;

    // Actions
    setCurrentChatId: (chatId: string | null) => void;
    addMessage: (message: Message) => void;
    updateStreamingMessage: (content: string) => void;
    finalizeStreamingMessage: () => void;
    setStreaming: (isStreaming: boolean) => void;
    setError: (error: string | null) => void;
    initializeChat: (chatId: string, userId: string, contractId: string) => void;
    getCurrentChat: () => Chat | null;
    resetChat: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
    currentChatId: null,
    chats: new Map(),
    isStreaming: false,
    streamingMessageId: null,
    error: null,

    setCurrentChatId: (chatId) => set({ currentChatId: chatId }),

    addMessage: (message) => {
        const { currentChatId, chats } = get();
        if (!currentChatId) return;

        const chat = chats.get(currentChatId);
        if (!chat) return;

        const updatedChat = {
            ...chat,
            messages: [...chat.messages, message],
        };

        const newChats = new Map(chats);
        newChats.set(currentChatId, updatedChat);

        set({ chats: newChats });
    },

    updateStreamingMessage: (content) => {
        const { currentChatId, chats, streamingMessageId } = get();
        if (!currentChatId || !streamingMessageId) return;

        const chat = chats.get(currentChatId);
        if (!chat) return;

        const messageIndex = chat.messages.findIndex((m) => m.id === streamingMessageId);
        if (messageIndex === -1) return;

        const updatedMessages = [...chat.messages];
        updatedMessages[messageIndex] = {
            ...updatedMessages[messageIndex],
            content,
            isStreaming: true,
        };

        const updatedChat = {
            ...chat,
            messages: updatedMessages,
        };

        const newChats = new Map(chats);
        newChats.set(currentChatId, updatedChat);

        set({ chats: newChats });
    },

    finalizeStreamingMessage: () => {
        const { currentChatId, chats, streamingMessageId } = get();
        if (!currentChatId || !streamingMessageId) return;

        const chat = chats.get(currentChatId);
        if (!chat) return;

        const messageIndex = chat.messages.findIndex((m) => m.id === streamingMessageId);
        if (messageIndex === -1) return;

        const updatedMessages = [...chat.messages];
        updatedMessages[messageIndex] = {
            ...updatedMessages[messageIndex],
            isStreaming: false,
        };

        const updatedChat = {
            ...chat,
            messages: updatedMessages,
        };

        const newChats = new Map(chats);
        newChats.set(currentChatId, updatedChat);

        set({
            chats: newChats,
            isStreaming: false,
            streamingMessageId: null,
        });
    },

    setStreaming: (isStreaming) => set({ isStreaming }),

    setError: (error) => set({ error }),

    initializeChat: (chatId, userId, contractId) => {
        const { chats } = get();

        if (!chats.has(chatId)) {
            const newChat: Chat = {
                id: chatId,
                userId,
                contractId,
                messages: [],
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const newChats = new Map(chats);
            newChats.set(chatId, newChat);

            set({ chats: newChats, currentChatId: chatId });
        } else {
            set({ currentChatId: chatId });
        }
    },

    getCurrentChat: () => {
        const { currentChatId, chats } = get();
        if (!currentChatId) return null;
        return chats.get(currentChatId) || null;
    },

    resetChat: () => {
        set({
            currentChatId: null,
            isStreaming: false,
            streamingMessageId: null,
            error: null,
        });
    },
}));
