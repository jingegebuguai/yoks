import { useStore } from "@yoki/react";
import { countStore } from "./store/count";
import { userStore } from "./store/user";
import "./App.css";

function Counter() {
  const { count, increase, decrease, increaseBy, initCount } =
    useStore(countStore);

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

function UserPanel() {
  const state = useStore(userStore);

  const handleLogin = () => {
    userStore.actions.login("test@test.com", "123456");
  };

  return (
    <div className="user-panel">
      <h2>User Example</h2>
      {state.loading ? (
        <p>Loading...</p>
      ) : state.error ? (
        <p className="error">{state.error}</p>
      ) : state.userInfo ? (
        <div className="user-info">
          <p>Welcome, {state.userInfo.name}!</p>
          <p>Email: {state.userInfo.email}</p>
          <button onClick={() => userStore.actions.logout()}>Logout</button>
        </div>
      ) : (
        <div className="login-form">
          <p>Please login to continue</p>
          <button onClick={handleLogin}>Login</button>
          <p className="hint">(Use test@test.com / 123456 for demo login)</p>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <div className="app">
      <h1>Yoki Store Examples</h1>
      <Counter />
      <hr />
      <UserPanel />
    </div>
  );
}
