import { useStore } from '@yoks/react';
import React, { useState } from 'react';
import { TodoItem, todoStore } from '../store/persist';

export const TodoList: React.FC = () => {
  const [newTodo, setNewTodo] = useState('');
  const { todos, filter, addTodo, toggleTodo, deleteTodo, setFilter } =
    useStore(todoStore);

  const filteredTodos = todos.filter((todo: TodoItem) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    addTodo(newTodo);
    setNewTodo('');
  };

  return (
    <div className="todo-container">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newTodo}
          onChange={e => setNewTodo(e.target.value)}
          placeholder="What needs to be done?"
        />
        <button type="submit">Add Todo</button>
      </form>

      <div className="filters button-group">
        <button
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={filter === 'active' ? 'active' : ''}
          onClick={() => setFilter('active')}
        >
          Active
        </button>
        <button
          className={filter === 'completed' ? 'active' : ''}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
      </div>

      <ul className="todo-list">
        {filteredTodos.map((todo: TodoItem) => (
          <li key={todo.id} className={todo.completed ? 'completed' : ''}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <span>{todo.text}</span>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
            <small>{new Date(todo.createdAt).toLocaleString()}</small>
          </li>
        ))}
      </ul>

      <div className="todo-stats">
        <p>Total: {todos.length}</p>
        <p>Active: {todos.filter((t: TodoItem) => !t.completed).length}</p>
        <p>Completed: {todos.filter((t: TodoItem) => t.completed).length}</p>
      </div>
    </div>
  );
};
