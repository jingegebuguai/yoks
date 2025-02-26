import { create } from 'zustand';

export interface CounterState {
  count: number;
  items: Array<{ id: number; value: string }>;
  increment: () => void;
  decrement: () => void;
  addItem: () => void;
  updateItem: (id: number, value: string) => void;
  removeItem: (id: number) => void;
  reset: () => void;
}

export const useZustandStore = create<CounterState>(set => ({
  count: 0,
  items: [],
  increment: () => set(state => ({ count: state.count + 1 })),
  decrement: () => set(state => ({ count: state.count - 1 })),
  addItem: () =>
    set(state => {
      const newId =
        state.items.length > 0 ? Math.max(...state.items.map(item => item.id)) + 1 : 1;
      return {
        items: [...state.items, { id: newId, value: `Item ${newId}` }],
      };
    }),
  updateItem: (id, value) =>
    set(state => ({
      items: state.items.map(item => (item.id === id ? { ...item, value } : item)),
    })),
  removeItem: id =>
    set(state => ({
      items: state.items.filter(item => item.id !== id),
    })),
  reset: () => set({ count: 0, items: [] }),
}));
