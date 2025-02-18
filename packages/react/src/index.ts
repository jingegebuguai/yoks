import { useEffect, useState, useRef } from 'react';
import { Yoks, StoreActions } from 'packages/core/src/core';

export function useStore<T extends object, A extends StoreActions<T>>(
  store: Yoks<T, A>,
  deps?: Array<keyof T>,
): T & A {
  const [state, setState] = useState(() => store.getState());
  const storeRef = useRef(store);
  const depsRef = useRef(deps);

  useEffect(() => {
    const listener = (newState: T) => {
      if (depsRef.current) {
        setState(prevState => {
          const changes: Partial<T> = {};

          let hasChanges = false;

          depsRef.current?.forEach(key => {
            if (prevState[key] !== newState[key]) {
              changes[key] = newState[key];
              hasChanges = true;
            }
          });

          return hasChanges ? { ...prevState, ...changes } : prevState;
        });

        return;
      }

      setState(newState);
    };

    const unsubscribe = storeRef.current.subscribe(listener, depsRef.current);

    return () => {
      unsubscribe();
    };
  }, [store]);

  return { ...state, ...store.actions };
}
