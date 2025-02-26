import { atom, useAtom } from 'jotai';

export interface Item {
  id: number;
  value: string;
}

export const countAtom = atom(0);
export const itemsAtom = atom<Item[]>([]);

export const useJotaiCounter = () => {
  const [count, setCount] = useAtom(countAtom);
  const [items, setItems] = useAtom(itemsAtom);

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);

  const addItem = () => {
    const newId = items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
    setItems([...items, { id: newId, value: `Item ${newId}` }]);
  };

  const updateItem = (id: number, value: string) => {
    setItems(items.map(item => (item.id === id ? { ...item, value } : item)));
  };

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const reset = () => {
    setCount(0);
    setItems([]);
  };

  return {
    count,
    items,
    increment,
    decrement,
    addItem,
    updateItem,
    removeItem,
    reset,
  };
};
