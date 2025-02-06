type Listener = () => void;

export class Store<T extends object> {
  private state: T;
  private listeners: Set<Listener> = new Set();

  constructor(initialState: T) {
    this.state = this.createProxy(initialState);
  }

  private createProxy(initialState: T): T {
    return new Proxy(initialState, {
      set: (target, property, value) => {
        target[property as keyof T] = value;
        this.notify();
        return true;
      },
      get: (target, property) => {
        const value = target[property as keyof T];

        if (typeof value === "object" && value !== null) {
          return this.createProxy(value as T);
        }

        return value;
      },
    });
  }

  // constructor(initialState: T) {
  //   this.state = new Proxy(initialState, {
  //     set: (target, property, value) => {
  //       target[property as keyof T] = value;
  //       this.notify();
  //       return true;
  //     },
  //     get: (target, property) => {
  //       const value = target[property as keyof T];
  //       return value;
  //     },
  //   });
  // }

  getState(): T {
    return this.state;
  }

  // setState(partial: Partial<T> | ((state: T) => Partial<T>)) {
  //   const nextState =
  //     typeof partial === "function" ? partial(this.state) : partial;

  //   Object.assign(this.state, nextState);

  //   this.notify();
  // }

  setState(partial: Partial<T> | ((state: T) => Partial<T>)) {
    const nextState =
      typeof partial === "function" ? partial(this.state) : partial;

    let hasChanged = false;

    Object.keys(nextState).forEach((key) => {
      const value = nextState[key as keyof T];
      const currentValue = this.state[key as keyof T];

      if (value !== currentValue) {
        hasChanged = true;
        // 创建一个新的引用
        if (Array.isArray(value)) {
          console.info("state", nextState);

          Object.assign(this.state, nextState);

          // this.state = {
          //   ...this.state,
          //   [key]: [...value],
          // };
        } else if (typeof value === "object" && value !== null) {
          this.state = {
            ...this.state,
            [key]: { ...value },
          };
        } else {
          this.state = {
            ...this.state,
            [key]: value,
          };
        }
      }
    });

    // if (hasChanged) {
    //   console.log("State update11d:", this.state);
    //   this.notify();
    // }
    this.notify();
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    console.log("State updated:", this.state);

    this.listeners.forEach((listener) => listener());
  }
}

// type Listener = () => void;

// export class Store<T extends object> {
//   private listeners: Set<Listener> = new Set();
//   private state: T;

//   constructor(initialState: T) {
//     this.state = initialState;
//   }

//   getState(): T {
//     return this.state;
//   }

//   setState(partial: Partial<T> | ((state: T) => Partial<T>)) {
//     const nextState =
//       typeof partial === "function" ? partial(this.state) : partial;

//     let hasChanged = false;

//     Object.keys(nextState).forEach((key) => {
//       const value = nextState[key as keyof T];
//       const currentValue = this.state[key as keyof T];

//       if (value !== currentValue) {
//         hasChanged = true;
//         // 创建一个新的引用
//         if (Array.isArray(value)) {
//           this.state = {
//             ...this.state,
//             [key]: [...value],
//           };
//         } else if (typeof value === "object" && value !== null) {
//           this.state = {
//             ...this.state,
//             [key]: { ...value },
//           };
//         } else {
//           this.state = {
//             ...this.state,
//             [key]: value,
//           };
//         }
//       }
//     });

//     if (hasChanged) {
//       this.notify();
//     }
//   }

//   subscribe(listener: Listener): () => void {
//     this.listeners.add(listener);
//     return () => this.listeners.delete(listener);
//   }

//   private notify() {
//     this.listeners.forEach((listener) => listener());
//   }
// }
