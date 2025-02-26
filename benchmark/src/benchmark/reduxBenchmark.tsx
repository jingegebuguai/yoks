import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { reduxStore, reduxActions, CounterState } from '../store/reduxStore';

interface ReduxBenchmarkProps {
  itemCount?: number;
  onComplete?: () => void;
}

const ReduxBenchmark: React.FC<ReduxBenchmarkProps> = ({
  itemCount = 1000,
  onComplete,
}) => {
  const dispatch = useDispatch();
  const { count, items } = useSelector((state: CounterState) => state);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (isRunning) {
      const startTime = performance.now();

      // Reset store
      dispatch(reduxActions.reset());

      // Add items
      for (let i = 0; i < itemCount; i++) {
        dispatch(reduxActions.addItem());
      }

      // Get updated items
      const updatedItems = reduxStore.getState().items;

      // Update items
      updatedItems.forEach(item => {
        dispatch(reduxActions.updateItem(item.id, `Updated ${item.id}`));
      });

      // Increment counter multiple times
      for (let i = 0; i < 100; i++) {
        dispatch(reduxActions.increment());
      }

      // Remove half of the items
      const itemsToRemove = updatedItems
        .filter((_, index) => index % 2 === 0)
        .map(item => item.id);

      itemsToRemove.forEach(id => {
        dispatch(reduxActions.removeItem(id));
      });

      const endTime = performance.now();
      console.log(`Redux benchmark completed in ${endTime - startTime}ms`);

      setIsRunning(false);
      if (onComplete) onComplete();
    }
  }, [isRunning, dispatch, itemCount, onComplete]);

  const runBenchmark = () => {
    setIsRunning(true);
  };

  return (
    <div>
      <h2>Redux Benchmark</h2>
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

export default ReduxBenchmark;
