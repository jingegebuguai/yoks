import React, { useState, useEffect } from 'react';
import { useStore } from '@yoks/react';
import { yoksStore } from '../store/yoksStore';

interface YoksBenchmarkProps {
  itemCount?: number;
  onComplete?: () => void;
}

const YoksBenchmark: React.FC<YoksBenchmarkProps> = ({
  itemCount = 1000,
  onComplete,
}) => {
  const store = useStore(yoksStore);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (isRunning) {
      const startTime = performance.now();

      // Reset store
      store.reset();

      // Add items
      for (let i = 0; i < itemCount; i++) {
        store.addItem();
      }

      // Update items
      store.items.forEach((item: { id: number }) => {
        store.updateItem(item.id, `Updated ${item.id}`);
      });

      // Increment counter multiple times
      for (let i = 0; i < 100; i++) {
        store.increment();
      }

      // Remove half of the items
      const itemsToRemove = store.items
        .filter((_item: { id: number }, index: number) => index % 2 === 0)
        .map((item: { id: number }) => item.id);

      itemsToRemove.forEach((id: number) => {
        store.removeItem(id);
      });

      const endTime = performance.now();
      console.log(`Yoks benchmark completed in ${endTime - startTime}ms`);

      setIsRunning(false);
      if (onComplete) onComplete();
    }
  }, [isRunning, store, itemCount, onComplete]);

  const runBenchmark = () => {
    setIsRunning(true);
  };

  return (
    <div>
      <h2>Yoks Benchmark</h2>
      <button onClick={runBenchmark} disabled={isRunning}>
        {isRunning ? 'Running...' : 'Run Benchmark'}
      </button>

      <div>
        <p>Count: {store.count}</p>
        <p>Items: {store.items.length}</p>
      </div>
    </div>
  );
};

export default YoksBenchmark;
