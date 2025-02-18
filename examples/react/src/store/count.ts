import { Yoks } from '@yoks/core';

type CountState = { count: number };

const countStore = new Yoks<
  CountState,
  {
    increase: () => (state: CountState) => CountState;
    increaseBy: (n: number) => (state: CountState) => CountState;
    decrease: () => (state: CountState) => CountState;
    initCount: () => CountState;
  }
>(
  { count: 1 },
  {
    increase: () => (state: CountState) => ({ count: state.count + 1 }),
    increaseBy: (n: number) => (state: CountState) => ({
      count: state.count + n,
    }),
    decrease: () => (state: CountState) => ({ count: state.count - 1 }),
    initCount: () => ({ count: 0 }),
  },
  {
    persist: {
      key: 'count',
    },
  },
);

export { countStore };
