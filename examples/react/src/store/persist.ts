import { Yoks } from '@yoks/core';
import LZString from 'lz-string';

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

export interface TodoState {
  todos: TodoItem[];
  filter: 'all' | 'active' | 'completed';
  lastUpdated?: number;
}

const initialState: TodoState = {
  todos: [],
  filter: 'all',
};

// 创建 todo store
export const todoStore = new Yoks<
  TodoState,
  {
    addTodo: (text: string) => (state: TodoState) => TodoState;
    toggleTodo: (id: string) => (state: TodoState) => TodoState;
    deleteTodo: (id: string) => (state: TodoState) => TodoState;
    setFilter: (filter: TodoState['filter']) => (state: TodoState) => TodoState;
  }
>(
  initialState,
  {
    addTodo: (text: string) => state => ({
      ...state,
      todos: [
        ...state.todos,
        {
          id: Date.now().toString(),
          text,
          completed: false,
          createdAt: new Date().toISOString(),
        },
      ],
    }),

    toggleTodo: (id: string) => state => ({
      ...state,
      todos: state.todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    }),

    deleteTodo: (id: string) => state => ({
      ...state,
      todos: state.todos.filter(todo => todo.id !== id),
    }),

    setFilter: (filter: TodoState['filter']) => state => ({
      ...state,
      filter,
    }),
  },
  {
    persist: {
      key: 'todo-store',
      version: 1,
      // 使用 LZString 压缩数据
      serialize: state => LZString.compress(JSON.stringify(state)),
      deserialize: str => JSON.parse(LZString.decompress(str) || ''),
      // 只持久化 todos 数组
      partialize: state => ({
        todos: state.todos,
        lastUpdated: Date.now(),
      }),
    },
  },
);
