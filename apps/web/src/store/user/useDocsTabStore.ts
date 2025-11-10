import { create } from 'zustand';

export enum TabType {
    CLIENT = 'CLIENT',
    DEV = 'DEV',
}

interface DocsTabStore {
    tab: TabType;
    setActiveTab: (tab: TabType) => void;
}

export const useDocsTabStore = create<DocsTabStore>((set) => ({
    tab: TabType.CLIENT,
    setActiveTab: (tab: TabType) => set({ tab }),
}));
