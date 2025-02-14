# Updating State

yoks provides flexible ways to update your store's state. Let's explore the different approaches to state updates.

## Basic Actions

Actions are the recommended way to update state in yoks. They are functions that describe how the state should change.

### Function Actions

The most common way is to use a function that receives the current state and returns the new state:

```typescript
const counterStore = new Store(
  { count: 0 },
  {
    // Basic action without parameters
    increment: () => state => ({
      ...state,
      count: state.count + 1,
    }),
    // Action with parameters
    add: (amount: number) => state => ({
      ...state,
      count: state.count + amount,
    }),
  },
);
```

### Direct State Actions

You can also return the new state directly without using a function:

```typescript
const userStore = new Store(
  { name: '', age: 0 },
  {
    // Directly return new state
    reset: () => ({ name: '', age: 0 }),
    // With parameters
    updateUser: (name: string, age: number) => ({
      name,
      age,
    }),
  },
);
```

## Working with Complex State

### Nested Objects

When dealing with nested objects, make sure to maintain immutability:

```typescript
interface UserState {
  profile: {
    name: string;
    settings: {
      theme: string;
      notifications: boolean;
    };
  };
}

const userStore = new Store<UserState>(
  {
    profile: {
      name: 'John',
      settings: {
        theme: 'light',
        notifications: true,
      },
    },
  },
  {
    updateTheme: (theme: string) => state => ({
      ...state,
      profile: {
        ...state.profile,
        settings: {
          ...state.profile.settings,
          theme,
        },
      },
    }),
  },
);
```

### Array

When working with arrays, use immutable array methods:

```typescript
interface TodoState {
  todos: { id: number; text: string; done: boolean }[];
}
const todoStore = new Store<TodoState>(
  { todos: [] },
  {
    // Add todo
    addTodo: (text: string) => state => ({
      ...state,
      todos: [...state.todos, { id: Date.now(), text, done: false }],
    }),
    // Remove todo
    removeTodo: (id: number) => state => ({
      ...state,
      todos: state.todos.filter(todo => todo.id !== id),
    }),
    // Toggle todo
    toggleTodo: (id: number) => state => ({
      ...state,
      todos: state.todos.map(todo =>
        todo.id === id ? { ...todo, done: !todo.done } : todo,
      ),
    }),
  },
);
```

## Best Practices

### 1. Keep Actions Pure

Actions should be pure functions without side effects:

```typescript
// ❌ Bad - Side effects in action
{
  saveUser: user => state => {
    fetch('/api/users', { method: 'POST', body: JSON.stringify(user) }); // Side effect!
    return { ...state, user };
  };
}
// ✅ Good - Pure action
{
  setUser: user => state => ({
    ...state,
    user,
  });
}
```

### 2. Use Descriptive Action Names

Choose clear, descriptive names for your actions:

```typescript
// ❌ Bad
{
  u: (name) => (state) => ({ ...state, name }),
  do: () => (state) => ({ ...state, count: state.count + 1 })
}
// ✅ Good
{
  updateUsername: (name) => (state) => ({ ...state, name }),
  incrementCounter: () => (state) => ({ ...state, count: state.count + 1 })
}
```

### 3. Maintain Immutability

Always create new object references when updating state:

```typescript
// ❌ Bad - Mutating state directly
{
  updateAge: age => state => {
    state.age = age; // Direct mutation!
    return state;
  };
}
// ✅ Good - Creating new state
{
  updateAge: age => state => ({
    ...state,
    age,
  });
}
```

### 4. Type Safety

Take advantage of TypeScript to ensure type safety:

```typescript
interface UserState {
  name: string;
  age: number;
}

interface UserActions {
  updateName: (name: string) => void;
  updateAge: (age: number) => void;
}

const userStore = new Store<UserState, UserActions>(
  { name: '', age: 0 },
  {
    updateName: (name: string) => state => ({
      ...state,
      name,
    }),
    updateAge: (age: number) => state => ({
      ...state,
      age,
    }),
  },
);
```

## Performance Considerations

### Selective Updates

:::tip
This ensures that components only re-render when their specific dependencies change, improving performance in your application.
:::

When using the store in components, subscribe only to the state properties you need:

```tsx
// React component example
function UserProfile() {
  // Only re-renders when 'name' changes
  const { name, updateName } = useStore(userStore, ['name']);
  return (
    <div>
      <input value={name} onChange={e => updateName(e.target.value)} />
    </div>
  );
}
```
