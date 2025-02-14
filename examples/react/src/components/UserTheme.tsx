import { useStore } from '@yoks/react';
import { userStore } from '../store/user';
// import "./UserThemeTest.css";

export default function UserTheme() {
  const { theme, setUserTheme } = useStore(userStore, ['theme']);

  const toggleTheme = () => {
    setUserTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className={`theme-container ${theme}`}>
      <h2>Theme Test</h2>

      <div className="theme-content">
        <p>Current Theme: {theme}</p>

        <button onClick={toggleTheme}>
          Switch to {theme === 'light' ? 'Dark' : 'Light'} Theme
        </button>
      </div>
    </div>
  );
}
