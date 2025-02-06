import { Store } from "@yoki/core";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

interface TodoState {
  todos: Todo[];
}

const initialState: TodoState = {
  todos: [],
};

export const todoStore = new Store<TodoState>(initialState);

// Action creators
export const addTodo = (text: string) => {
  todoStore.setState((state) => ({
    todos: [
      ...state.todos,
      {
        id: Date.now(),
        text,
        completed: false,
      },
    ],
  }));
};

export const toggleTodo = (id: number) => {
  todoStore.setState((state) => ({
    todos: state.todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ),
  }));
};

export const removeTodo = (id: number) => {
  todoStore.setState((state) => ({
    todos: state.todos.filter((todo) => todo.id !== id),
  }));
};
