import { SidePanelValues } from "@/src/components/code/EditorSidePanel";
import { create } from "zustand";

interface SidePanelState {
    currentState: string | null;
    setCurrentState: (value: SidePanelValues | null) => void;
}

// use SidePanelValues and remove string
export const useSidePanelStore = create<SidePanelState>((set) => ({
    currentState: 'FILE',
    setCurrentState: (value: SidePanelValues | null) => set({ currentState: value }),
}))