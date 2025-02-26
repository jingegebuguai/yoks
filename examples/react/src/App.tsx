import { BrowserRouter, Routes, Route, NavLink } from 'react-router';
import Base from './app/base';
import Persist from './app/persist';
import React from 'react';
import './App.css';

export const Navigation: React.FC = () => {
  return (
    <nav className="navigation">
      <NavLink to="/" className={({ isActive }) => `link ${isActive ? 'active' : ''}`}>
        Home
      </NavLink>
      <NavLink
        to="/persist"
        className={({ isActive }) => `link ${isActive ? 'active' : ''}`}
      >
        Persist
      </NavLink>
    </nav>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="App">
        <h1>Todo App with Persisted State</h1>
        <Navigation />
        <Routes>
          <Route path="/" element={<Base />} />
          <Route path="/persist" element={<Persist />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
