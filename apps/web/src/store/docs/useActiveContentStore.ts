import { ClientDocsPanel } from '@/src/types/docs-types';
import { create } from 'zustand';

interface ActiveContentStore {
    activeContent: ClientDocsPanel;
    setActiveContent: (content: ClientDocsPanel) => void;
}

export const useActiveContentStore = create<ActiveContentStore>((set) => ({
    activeContent: ClientDocsPanel.OVERVIEW,
    setActiveContent: (content: ClientDocsPanel) => set({ activeContent: content }),
}));
