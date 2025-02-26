import { useEffect, useState, useRef, useMemo } from 'react';
import { Yoks, StoreActions } from 'packages/core/src/core';

export function useStore<T extends object, A extends StoreActions<T>>(
  store: Yoks<T, A>,
  deps?: Array<keyof T>,
): T & A {
  const [state, setState] = useState(() => store.getState());
  const storeRef = useRef(store);
  const depsRef = useRef(deps);

  // 使用 useMemo 缓存合并后的对象，避免每次渲染都创建新对象
  const result = useMemo(() => {
    return Object.assign({}, state, store.actions);
  }, [state, store.actions]);

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
    return unsubscribe;
  }, [store]);

  return result;
}
