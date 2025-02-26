import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { useStore } from '@yoks/react';
import { yoksStore } from './store/yoksStore';
import { useZustandStore } from './store/zustandStore';
import { useSelector, useDispatch } from 'react-redux';
import { reduxActions, CounterState } from './store/reduxStore';
import { useRecoilCounter } from './store/recoilStore';
import { useJotaiCounter } from './store/jotaiStore';
import { measureRenderTime } from './utils';

// Components for each library
const YoksComponent = ({ itemCount }: { itemCount: number }) => {
  const store = useStore(yoksStore);

  useEffect(() => {
    store.reset();
    for (let i = 0; i < itemCount; i++) {
      store.addItem();
    }
  }, [store, itemCount]);

  return (
    <div>
      <div>Count: {store.count}</div>
      <ul>
        {store.items.map((item: { id: number; value: string }) => (
          <li key={item.id}>{item.value}</li>
        ))}
      </ul>
    </div>
  );
};

const ZustandComponent = ({ itemCount }: { itemCount: number }) => {
  const { count, items, reset, addItem } = useZustandStore();

  useEffect(() => {
    reset();
    for (let i = 0; i < itemCount; i++) {
      addItem();
    }
  }, [reset, addItem, itemCount]);

  return (
    <div>
      <div>Count: {count}</div>
      <ul>
        {items.map(item => (
          <li key={item.id}>{item.value}</li>
        ))}
      </ul>
    </div>
  );
};

const ReduxComponent = ({ itemCount }: { itemCount: number }) => {
  const dispatch = useDispatch();
  const { count, items } = useSelector((state: CounterState) => state);

  useEffect(() => {
    dispatch(reduxActions.reset());
    for (let i = 0; i < itemCount; i++) {
      dispatch(reduxActions.addItem());
    }
  }, [dispatch, itemCount]);

  return (
    <div>
      <div>Count: {count}</div>
      <ul>
        {items.map(item => (
          <li key={item.id}>{item.value}</li>
        ))}
      </ul>
    </div>
  );
};

const RecoilComponent = ({ itemCount }: { itemCount: number }) => {
  const { count, items, reset, addItem } = useRecoilCounter();

  useEffect(() => {
    reset();
    for (let i = 0; i < itemCount; i++) {
      addItem();
    }
  }, [reset, addItem, itemCount]);

  return (
    <div>
      <div>Count: {count}</div>
      <ul>
        {items.map(item => (
          <li key={item.id}>{item.value}</li>
        ))}
      </ul>
    </div>
  );
};

const JotaiComponent = ({ itemCount }: { itemCount: number }) => {
  const { count, items, reset, addItem } = useJotaiCounter();

  useEffect(() => {
    reset();
    for (let i = 0; i < itemCount; i++) {
      addItem();
    }
  }, [reset, addItem, itemCount]);

  return (
    <div>
      <div>Count: {count}</div>
      <ul>
        {items.map(item => (
          <li key={item.id}>{item.value}</li>
        ))}
      </ul>
    </div>
  );
};

// Benchmark function
export const runRenderBenchmark = async (itemCount: number, iterations: number = 5) => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);

  try {
    // Measure Yoks render time
    const yoksTime = await measureRenderTime(() => {
      root.render(<YoksComponent itemCount={itemCount} />);
    }, iterations);

    // Measure Zustand render time
    const zustandTime = await measureRenderTime(() => {
      root.render(<ZustandComponent itemCount={itemCount} />);
    }, iterations);

    // Measure Redux render time
    const reduxTime = await measureRenderTime(() => {
      root.render(<ReduxComponent itemCount={itemCount} />);
    }, iterations);

    // Measure Recoil render time
    const recoilTime = await measureRenderTime(() => {
      root.render(<RecoilComponent itemCount={itemCount} />);
    }, iterations);

    // Measure Jotai render time
    const jotaiTime = await measureRenderTime(() => {
      root.render(<JotaiComponent itemCount={itemCount} />);
    }, iterations);

    return {
      yoks: yoksTime,
      zustand: zustandTime,
      redux: reduxTime,
      recoil: recoilTime,
      jotai: jotaiTime,
    };
  } finally {
    root.unmount();
    document.body.removeChild(container);
  }
};
