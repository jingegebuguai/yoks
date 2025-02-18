import { create } from 'domain';
import { SafeAny } from './types';

export type PersistStorageValue<T> = { state: T; version: number };

export interface DefaultStore {
  setItem(key: string, value: SafeAny): Promise<void> | void;
  getItem: (key: SafeAny) => Promise<string | null> | string | null;
  removeItem: (key: SafeAny) => Promise<void> | void;
  clear: () => Promise<void> | void;
}

export interface PersistStorage<T> {
  setItem: (key: string, value: PersistStorageValue<T>) => Promise<void> | void;
  getItem: (
    key: string,
  ) => PersistStorageValue<T> | Promise<PersistStorageValue<T> | null> | null;
  removeItem: (key: string) => Promise<void> | void;
  clear: () => Promise<void> | void;
}

export type PersistOptions<T> = {
  // default localStorage
  key: string;
  version?: number;
  storage?: PersistStorage<T>;
  // migrate?: (persistedState: SafeAny, version: number) => T; // 数据迁移函数
};

export const createJSONStorage = <T>(getStorage: () => DefaultStore) => {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  const PersistStorage = {
    setItem: (key: string, value: PersistStorageValue<T>) => {
      storage.setItem(key, JSON.stringify(value));
    },
    getItem: (key: string) => {
      const value = storage.getItem(key);
      const parse = (value: string | null) => {
        if (!value) {
          return null;
        }

        try {
          return JSON.parse(value) as PersistStorageValue<T>;
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (_) {
          return null;
        }
      };

      if (value instanceof Promise) {
        return value.then(parse) as Promise<PersistStorageValue<T>>;
      }

      return parse(value) as PersistStorageValue<T>;
    },
    removeItem: (key: string) => {
      storage.removeItem(key);
    },
    clear: () => {
      storage.clear();
    },
  };

  return PersistStorage;
};

export const initPersist = async <T>(
  options: PersistOptions<T>,
  setState: (state: T) => void,
  getState: () => T,
) => {
  const { key, storage = createJSONStorage(() => localStorage), version = 0 } = options;

  if (!storage) {
    return undefined;
  }

  // Load persisted state
  const persistedState = await storage.getItem(key);

  if (persistedState) {
    // TODO: migrate
    // const state = migrate && version ? migrate(persistedState, version) : persistedState;

    setState(persistedState.state);
  } else {
    // If no persisted state, save the initial state
    const initialState = getState();
    await storage.setItem(key, { state: initialState, version });
  }

  // Return state save function
  return async (state: T) => {
    await storage.setItem(key, { state, version });
  };
};
