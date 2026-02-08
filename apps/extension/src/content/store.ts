import { create } from 'zustand';

interface State {
    jsonInput: string;
    parsedData: Record<string, any> | null;
    mappings: Record<string, string>; // jsonKey -> selector
    activeKey: string | null; // Key currently being mapped
    isSelecting: boolean; // Is the picker active?
    isOpen: boolean;

    setJsonInput: (input: string) => void;
    setMapping: (key: string, selector: string) => void;
    startSelecting: (key: string) => void;
    stopSelecting: () => void;
    clearMappings: () => void;
    toggleSidebar: () => void;
}

export const useStore = create<State>((set) => ({
    jsonInput: '',
    parsedData: null,
    mappings: {},
    activeKey: null,
    isSelecting: false,
    isOpen: true,

    setJsonInput: (input) => {
        try {
            const parsed = JSON.parse(input);
            set({ jsonInput: input, parsedData: parsed });
        } catch (e) {
            set({ jsonInput: input, parsedData: null });
        }
    },
    setMapping: (key, selector) => set((state) => ({
        mappings: { ...state.mappings, [key]: selector },
        activeKey: null,
        isSelecting: false
    })),
    startSelecting: (key) => set({ activeKey: key, isSelecting: true }),
    stopSelecting: () => set({ activeKey: null, isSelecting: false }),
    clearMappings: () => set({ mappings: {} }),
    toggleSidebar: () => set((state) => ({ isOpen: !state.isOpen })),
}));
