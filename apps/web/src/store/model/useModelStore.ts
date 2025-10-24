import { MODEL } from '@/src/types/extra_types';
import { create } from 'zustand';

interface ModelState {
    selectedModel: MODEL;
    setSelectedModel: (model: MODEL) => void;
}

export const useModelStore = create<ModelState>((set) => ({
    selectedModel: MODEL.GEMINI,
    setSelectedModel: (model: MODEL) => set({ selectedModel: model }),
}));
