import { Yoks } from '@yoks/core';

export interface CounterState {
  count: number;
  items: Array<{ id: number; value: string }>;
}

export const yoksStore = new Yoks<
  CounterState,
  {
    increment: () => (state: CounterState) => CounterState;
    decrement: () => (state: CounterState) => CounterState;
    addItem: () => (state: CounterState) => CounterState;
    updateItem: (id: number, value: string) => (state: CounterState) => CounterState;
    removeItem: (id: number) => (state: CounterState) => CounterState;
    reset: () => CounterState;
  }
>(
  {
    count: 0,
    items: [],
  },
  {
    increment: () => state => ({
      ...state,
      count: state.count + 1,
    }),
    decrement: () => state => ({
      ...state,
      count: state.count - 1,
    }),
    addItem: () => state => {
      const newId =
        state.items.length > 0 ? Math.max(...state.items.map(item => item.id)) + 1 : 1;
      return {
        ...state,
        items: [...state.items, { id: newId, value: `Item ${newId}` }],
      };
    },
    updateItem: (id, value) => state => ({
      ...state,
      items: state.items.map(item => (item.id === id ? { ...item, value } : item)),
    }),
    removeItem: id => state => ({
      ...state,
      items: state.items.filter(item => item.id !== id),
    }),
    reset: () => ({
      count: 0,
      items: [],
    }),
  },
);
