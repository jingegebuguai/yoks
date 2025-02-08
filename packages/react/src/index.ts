import { useEffect, useState, useRef } from "react";
import { Store, StoreActions } from "@yoki/core";

export function useStore<T extends object, A extends StoreActions<T>>(
  store: Store<T, A>
): T & A;
export function useStore<T extends object, A extends StoreActions<T>, S>(
  store: Store<T, A>,
  selector: (state: T) => S
): S & A;
export function useStore<T extends object, A extends StoreActions<T>, S = T>(
  store: Store<T, A>,
  selector?: (state: T) => S
): S & A {
  const selectorRef = useRef(selector);
  selectorRef.current = selector;

  const [state, setState] = useState(() =>
    selector ? selector(store.getState()) : (store.getState() as unknown as S)
  );

  useEffect(() => {
    const listener = (newState: T) => {
      const currentSelector = selectorRef.current;
      setState(
        currentSelector ? currentSelector(newState) : (newState as unknown as S)
      );
    };

    const unsubscribe = store.subscribe(listener, selector);

    return () => {
      unsubscribe();
    };
  }, [store]);

  return { ...state, ...store.actions };
}
