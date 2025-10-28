import { create } from 'zustand';

interface ChatState {
    contractId: string | null;
    setContractId: (chatId: string | null) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
    contractId: null,
    setContractId: (chatId: string | null) => set({ contractId: chatId }),
}));
