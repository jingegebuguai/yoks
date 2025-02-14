import { useStore } from '@yoks/react';
import { userStore } from '../store/user';

export default function UserPanel() {
  const state = useStore(userStore, ['userInfo', 'loading', 'error']);

  const handleLogin = () => {
    userStore.actions.login('test@test.com', '123456');
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
