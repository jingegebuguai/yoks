import React, { useState, useEffect } from 'react';
import { useZustandStore } from '../store/zustandStore';
// import { useZustandStore } from '../store/zustandStore';
interface ZustandBenchmarkProps {
  itemCount?: number;
  onComplete?: () => void;
}

const ZustandBenchmark: React.FC<ZustandBenchmarkProps> = ({
  itemCount = 1000,
  onComplete,
}) => {
  const { count, items, increment, addItem, updateItem, removeItem, reset } =
    useZustandStore();
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (isRunning) {
      const startTime = performance.now();

      // Reset store
      reset();

      // Add items
      for (let i = 0; i < itemCount; i++) {
        addItem();
      }

      // Update items
      items.forEach(item => {
        updateItem(item.id, `Updated ${item.id}`);
      });

      // Increment counter multiple times
      for (let i = 0; i < 100; i++) {
        increment();
      }

      // Remove half of the items
      const itemsToRemove = items
        .filter((_, index) => index % 2 === 0)
        .map(item => item.id);

      itemsToRemove.forEach(id => {
        removeItem(id);
      });

      const endTime = performance.now();
      console.log(`Zustand benchmark completed in ${endTime - startTime}ms`);

      setIsRunning(false);
      if (onComplete) onComplete();
    }
  }, [
    isRunning,
    items,
    itemCount,
    increment,
    addItem,
    updateItem,
    removeItem,
    reset,
    onComplete,
  ]);

  const runBenchmark = () => {
    setIsRunning(true);
  };

  return (
    <div>
      <h2>Zustand Benchmark</h2>
      <button onClick={runBenchmark} disabled={isRunning}>
        {isRunning ? 'Running...' : 'Run Benchmark'}
      </button>

      <div>
        <p>Count: {count}</p>
        <p>Items: {items.length}</p>
      </div>
    </div>
  );
};

export default ZustandBenchmark;
