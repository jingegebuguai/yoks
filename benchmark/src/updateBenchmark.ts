import { useZustandStore } from './store/zustandStore';
import { reduxStore, reduxActions } from './store/reduxStore';

import { measureUpdateTime } from './utils';

// Helper to reset all stores
const resetAllStores = () => {
  // Reset Yoks
  // TODO: Implement reset for Yoks
  // yoksStore.reset();

  // Reset Zustand
  const zustandReset = useZustandStore.getState().reset;
  zustandReset();

  // Reset Redux
  reduxStore.dispatch(reduxActions.reset());

  // Reset Recoil (needs to be done in a component context)

  // Reset Jotai (needs to be done in a component context)
};

// Benchmark function for state updates
export const runUpdateBenchmark = async (
  updateCount: number = 1000,
  iterations: number = 5,
) => {
  resetAllStores();

  // Measure Yoks update time
  const yoksTime = await measureUpdateTime(() => {
    for (let i = 0; i < updateCount; i++) {
      // TODO: Implement increment for Yoks
      // yoksStore.increment();
    }
  }, iterations);

  resetAllStores();

  // Measure Zustand update time
  const zustandTime = await measureUpdateTime(() => {
    const increment = useZustandStore.getState().increment;
    for (let i = 0; i < updateCount; i++) {
      increment();
    }
  }, iterations);

  resetAllStores();

  // Measure Redux update time
  const reduxTime = await measureUpdateTime(() => {
    for (let i = 0; i < updateCount; i++) {
      reduxStore.dispatch(reduxActions.increment());
    }
  }, iterations);

  // Note: Recoil and Jotai updates need to be measured in a component context
  // This is a simplified version

  return {
    yoks: yoksTime,
    zustand: zustandTime,
    redux: reduxTime,
    recoil: 0, // Placeholder
    jotai: 0, // Placeholder
  };
};
