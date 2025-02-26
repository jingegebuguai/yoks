import UserPanel from '../components/UserProfile';
import DeepState from '../components/DeepCount';
import Counter from '../components/Counter';
import UserTheme from '../components/UserTheme';
import useCounterStore from '../zustand/test';

export default function App() {
  const { count, increase, reset } = useCounterStore();

  return (
    <div className="app">
      <h1>yoks Store Examples</h1>
      <Counter />
      <hr />
      <UserPanel />
      <hr />
      <UserTheme />
      <hr />
      <DeepState />

      <div>
        <h1>计数器: {count}</h1>
        <button onClick={increase}>增加</button>
        <button onClick={reset}>重置</button>
      </div>
    </div>
  );
}
