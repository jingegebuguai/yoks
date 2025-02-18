import create from 'zustand';
import { persist } from 'zustand/middleware';

// 定义 Store
interface CounterState {
  count: number;
  increase: () => void;
  reset: () => void;
}

// 创建持久化 store
const useCounterStore = create<CounterState>()(
  persist(
    set => ({
      count: 0,
      increase: () => set(state => ({ count: state.count + 1 })),
      reset: () => set({ count: 0 }),
    }),
    {
      name: 'counter-storage', // 存储的 key
      getStorage: () => localStorage, // 使用 localStorage 作为存储介质
    },
  ),
);

export default useCounterStore;
