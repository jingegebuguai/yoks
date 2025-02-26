import { createStore } from 'redux';

export interface CounterState {
  count: number;
  items: Array<{ id: number; value: string }>;
}

type Action =
  | { type: 'INCREMENT' }
  | { type: 'DECREMENT' }
  | { type: 'ADD_ITEM' }
  | { type: 'UPDATE_ITEM'; id: number; value: string }
  | { type: 'REMOVE_ITEM'; id: number }
  | { type: 'RESET' };

const initialState: CounterState = {
  count: 0,
  items: [],
};

function counterReducer(state = initialState, action: Action): CounterState {
  switch (action.type) {
    case 'INCREMENT':
      return {
        ...state,
        count: state.count + 1,
      };
    case 'DECREMENT':
      return {
        ...state,
        count: state.count - 1,
      };
    case 'ADD_ITEM': {
      const newId =
        state.items.length > 0 ? Math.max(...state.items.map(item => item.id)) + 1 : 1;
      return {
        ...state,
        items: [...state.items, { id: newId, value: `Item ${newId}` }],
      };
    }
    case 'UPDATE_ITEM':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.id ? { ...item, value: action.value } : item,
        ),
      };
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.id),
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

export const reduxStore = createStore(counterReducer);

// Action creators
export const reduxActions = {
  increment: () => ({ type: 'INCREMENT' as const }),
  decrement: () => ({ type: 'DECREMENT' as const }),
  addItem: () => ({ type: 'ADD_ITEM' as const }),
  updateItem: (id: number, value: string) => ({
    type: 'UPDATE_ITEM' as const,
    id,
    value,
  }),
  removeItem: (id: number) => ({
    type: 'REMOVE_ITEM' as const,
    id,
  }),
  reset: () => ({ type: 'RESET' as const }),
};
