// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SafeAny = any;
type Listener<T> = (state: T) => void;

// setState can accept either partial state or a function returning partial state
type ActionFunction<T> = (...args: SafeAny[]) => (state: T) => T;
type ActionInitFunction<T> = (...args: SafeAny[]) => T;
export type StoreActions<T> = Record<string, ActionFunction<T> | ActionInitFunction<T>>;

export type StoreConfiguration = {
  createSelectors: boolean;
};

export class Store<T extends object, A extends StoreActions<T>> {
  private listeners: Set<Listener<T>> = new Set();
  private subscriptions: WeakMap<Listener<T>, Set<keyof T>> = new Map();
  private state: T;
  private _actions: A;

  constructor(initialState: T, actions: A, config?: StoreConfiguration) {
    this.state = initialState;

    const boundActions = {} as A;

    if (config?.createSelectors) {
      for (const key in initialState) {
        Object.defineProperty(this, key, {
          get: () => this.state[key],
          enumerable: true,
        });
      }
    }

    for (const key in actions) {
      const actionCreator = actions[key];
      boundActions[key] = ((...args: SafeAny[]) => {
        const actionResult = actionCreator(...args);

        // if actionsResult is a function, then it is a normal action
        if (typeof actionResult === 'function') {
          const nextState = actionResult(this.state);
          if (this.state === nextState) return;

          const prevState = this.state;

          this.state = nextState;
          this.notify(prevState);
          return;
        }

        // use actionResult as new state
        const prevState = this.state;
        this.state = actionResult;
        this.notify(prevState);
      }) as SafeAny;

      (this as SafeAny)[key] = boundActions[key];
    }
    this._actions = boundActions;
  }

  private notify(prevState: T) {
    this.listeners.forEach(listener => {
      const deps = this.subscriptions.get(listener);
      if (!deps) {
        listener(this.state);
        return;
      }

      const hasChanges = Array.from(deps).some(key => prevState[key] !== this.state[key]);

      if (hasChanges) {
        listener(this.state);
      }
    });
  }

  subscribe(listener: Listener<T>, deps?: Array<keyof T>): () => void {
    this.listeners.add(listener);

    if (deps) {
      this.subscriptions.set(listener, new Set(deps));
    }

    return () => {
      this.listeners.delete(listener);
      this.subscriptions.delete(listener);
    };
  }

  get actions(): A {
    return this._actions;
  }

  getState(): T {
    return this.state;
  }
}
