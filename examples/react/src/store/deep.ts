import { Store } from '@yoks/core';
import { produce } from 'immer';

type DeepState = {
  deep: {
    nested: {
      obj: {
        count: number;
      };
      arr: number[];
    };
  };
};

const countStore = new Store<
  DeepState,
  {
    increaseDeepCount: () => (state: DeepState) => DeepState;
    increaseDeepCountByImmer: () => (state: DeepState) => DeepState;
    initDeepCount: () => DeepState;
  }
>(
  {
    deep: {
      nested: {
        obj: {
          count: 0,
        },
        arr: [],
      },
    },
  },
  {
    increaseDeepCount: () => (state: DeepState) => ({
      deep: {
        ...state.deep,
        nested: {
          ...state.deep.nested,
          obj: {
            ...state.deep.nested.obj,
            count: state.deep.nested.obj.count + 1,
          },
          arr: [...state.deep.nested.arr, state.deep.nested.obj.count],
        },
      },
    }),
    increaseDeepCountByImmer: () =>
      produce((state: DeepState) => {
        const count = state.deep.nested.obj.count;

        state.deep.nested.obj.count++;
        state.deep.nested.arr.push(count);
      }),
    initDeepCount: () => ({
      deep: {
        nested: {
          obj: {
            count: 0,
          },
          arr: [],
        },
      },
    }),
  },
);

export { countStore };
