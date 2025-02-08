import { useState } from "react";
import { useStore } from "@yoki/react";
import { userStore, updatePreferences, logout } from "../store/user";

export const UserProfile = () => {
  const { profile, preferences } = useStore(userStore);
  const { isAuthenticated } = useStore(userStore, (state) => ({
    isAuthenticated: state.isAuthenticated,
  }));
  const [count, setCount] = useState(0);

  if (!isAuthenticated) return null;

  return (
    <div className="user-profile">
      {profile && (
        <>
          <h2>Welcome, {profile.name}</h2>
          <p>Email: {profile.email}</p>
        </>
      )}

      <span>Count Number: {count}</span>
      <span onClick={() => setCount(count + 1)}>Add Count</span>

      <div className="preferences">
        <h3>Preferences</h3>
        <label>
          <input
            type="checkbox"
            checked={preferences.theme === "dark"}
            onChange={(e) =>
              updatePreferences({
                theme: e.target.checked ? "dark" : "light",
              })
            }
          />
          Dark Theme
        </label>

        <label>
          <input
            type="checkbox"
            checked={preferences.notifications}
            onChange={(e) =>
              updatePreferences({
                notifications: e.target.checked,
              })
            }
          />
          Enable Notifications
        </label>
      </div>

      <button onClick={logout}>Logout</button>
    </div>
  );
};
