import { useStore } from '@yoks/react';
import { countStore } from '../store/count';

export default function Counter() {
  const { count, increase, decrease, increaseBy, initCount } = useStore(countStore);

  return (
    <div className="counter">
      <h2>Counter Example</h2>
      <p>Count: {count}</p>
      <div className="button-group">
        <button onClick={() => increase()}>Increment</button>
        <button onClick={() => decrease()}>Decrement</button>
        <button onClick={() => increaseBy(5)}>Add 5</button>
        <button onClick={() => initCount()}>Reset</button>
      </div>
    </div>
  );
}
