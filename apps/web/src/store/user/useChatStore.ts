import { create } from 'zustand';

interface ChatState {
    contractId: string | null;
    setContractId: (chatId: string | null) => void;
    resetContractId: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
    contractId: null,
    setContractId: (chatId: string | null) => set({ contractId: chatId }),
    resetContractId: () => set({ contractId: null }),
}));
