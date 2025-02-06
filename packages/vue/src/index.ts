import { ref, onUnmounted, Ref } from 'vue';
import { Store } from '@yoki/core';

export function useStore<T extends object>(store: Store<T>): Ref<T> {
  const state = ref(store.getState()) as Ref<T>;
  
  const unsubscribe = store.subscribe(() => {
    state.value = store.getState();
  });

  onUnmounted(() => {
    unsubscribe();
  });

  return state;
} 