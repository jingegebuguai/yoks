import './App.css';
import UserPanel from './components/UserProfile';
import DeepState from './components/DeepCount';
import Counter from './components/Counter';
import UserTheme from './components/UserTheme';

export default function App() {
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
    </div>
  );
}
