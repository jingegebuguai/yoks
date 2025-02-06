import { useEffect, useState } from "react";
import { Store } from "@yoki/core";

export function useStore<T extends object>(store: Store<T>): T {
  const [state, setState] = useState<T>(store.getState());

  useEffect(() => {
    // subscribe, then unsubscribe
    return store.subscribe(() => {
      setState(store.getState());
    });
  }, [store]);

  return state;
}
