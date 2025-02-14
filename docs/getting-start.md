# Getting Started

## Installation

### npm

```bash
npm install @yoks/core @yoks/react # for React
npm install @yoks/core @yoks/vue # for Vue
npm install @yoks/core @yoks/solid # for SolidJS
```

### pnpm

```bash
pnpm add @yoks/core @yoks/react # for React
pnpm add @yoks/core @yoks/vue # for Vue
pnpm add @yoks/core @yoks/solid # for SolidJS
```

## Basic Usage

### Create a Store

```typescript
import { Store } from '@yoks/core';
// Define your state type
interface CounterState {
  count: number;
}

// Create a store
const counterStore = new Store<CounterState>(
  // Initial state
  { count: 0 },
  // Actions
  {
    increment: () => state => ({ ...state, count: state.count + 1 }),
    decrement: () => state => ({ ...state, count: state.count - 1 }),
    add: (amount: number) => state => ({
      ...state,
      count: state.count + amount,
    }),
  },
  // Optional configuration
  { createSelectors: true },
);
```

### Use in React

```tsx
import { useStore } from '@yoks/react';
function Counter() {
  // Subscribe to specific state changes to prevent unnecessary re-renders
  const { count, increment, decrement, add } = useStore(counterStore, ['count']);

  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
      <button onClick={() => add(10)}>Add 10</button>
    </div>
  );
}
```
