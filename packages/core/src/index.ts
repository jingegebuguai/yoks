type Listener<T> = (state: T) => void;
type Selector<T, S> = (state: T) => S;

interface Subscription<T, S> {
  selector?: Selector<T, S>;
  lastValue?: any;
}

// setState can accept either partial state or a function returning partial state
type ActionFunction<T> = (...args: any[]) => (state: T) => T;
type ActionInitFunction<T> = (...args: any[]) => T;
export type StoreActions<T> = Record<
  string,
  ActionFunction<T> | ActionInitFunction<T>
>;

export class Store<T extends object, A extends StoreActions<T>> {
  private listeners: Set<Listener<T>> = new Set();
  private subscriptions: WeakMap<Listener<T>, Subscription<T, any>> =
    new WeakMap();
  private state: T;
  private _actions: A;

  constructor(initialState: T, actions: A) {
    this.state = initialState;

    const boundActions = {} as A;
    console.info("actions", actions);
    for (const key in actions) {
      const actionCreator = actions[key];
      boundActions[key] = ((...args: any[]) => {
        const actionResult = actionCreator(...args);

        // if actionsResult is a function, then it is a normal action
        if (typeof actionResult === "function") {
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
      }) as any;

      (this as any)[key] = boundActions[key];
    }
    this._actions = boundActions;
  }

  private notify(prevState: T) {
    this.listeners.forEach((listener) => {
      const subscription = this.subscriptions.get(listener);
      if (!subscription) return;

      const { selector, lastValue } = subscription;

      if (selector) {
        const currentValue = selector(this.state);
        if (currentValue !== lastValue) {
          subscription.lastValue = currentValue;
          listener(this.state);
        }
      } else {
        listener(this.state);
      }
    });
  }

  subscribe(listener: Listener<T>, selector?: Selector<T, any>): () => void {
    const subscription: Subscription<T, any> = {
      selector,
      lastValue: selector ? selector(this.state) : undefined,
    };
    this.listeners.add(listener);
    this.subscriptions.set(listener, subscription);

    return () => {
      this.listeners.delete(listener);
    };
  }

  get actions(): A {
    return this._actions;
  }

  getState(): T {
    return this.state;
  }
}
