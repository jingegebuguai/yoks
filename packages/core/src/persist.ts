import { SafeAny } from './types';

type JsonStorageOptions = {
  reviver?: (key: string, value: SafeAny) => SafeAny;
  replacer?: (key: string, value: SafeAny) => SafeAny;
};

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
  // storage key
  key: string;
  // storage version
  version?: number;
  // create storage to persist
  storage?: PersistStorage<T>;
  /**
   * migrate
   * @param persistedState
   * @param version
   * @returns
   */
  migrate?: (persistedState: SafeAny, version: number) => T;
  /**
   * serialize
   * @param state
   * @returns
   */
  serialize?: (state: T) => string;
  /**
   * deserialize
   * @param value
   * @returns
   */
  deserialize?: (value: string) => T;
  /**
   * partialize save to storage
   * @param state
   * @returns
   */
  partialize?: (state: T) => Partial<T>;
  /**
   * beforeSave
   * @param state
   * @returns
   */
  beforeSave?: (state: T) => T;
  /**
   * afterSave read from storage
   * @param state
   * @returns
   */
  afterRead?: (state: T) => T;
};

export const createJSONStorage = <T>(
  getStorage: () => DefaultStore,
  options?: JsonStorageOptions & Pick<PersistOptions<T>, 'serialize' | 'deserialize'>,
) => {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  const PersistStorage = {
    setItem: (key: string, value: PersistStorageValue<T>) => {
      const serialized = options?.serialize
        ? options.serialize(value.state)
        : JSON.stringify(value, options?.replacer);

      storage.setItem(key, serialized);
    },
    getItem: (key: string) => {
      const value = storage.getItem(key);
      const parse = (value: string | null) => {
        if (!value) {
          return null;
        }

        try {
          return options?.deserialize
            ? options.deserialize(value)
            : (JSON.parse(value, options?.reviver) as PersistStorageValue<T>);
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
  const {
    key,
    storage = createJSONStorage(() => localStorage),
    migrate,
    afterRead,
    beforeSave,
    partialize,
    version = 0,
  } = options;

  if (!storage) {
    return undefined;
  }

  // Load persisted state
  const persistedState = await storage.getItem(key);

  if (persistedState) {
    const newState =
      migrate && version ? migrate(persistedState, version) : persistedState.state;

    // Apply afterRead transformation if provided
    const processedState = afterRead ? afterRead(newState) : newState;
    setState(processedState);
  } else {
    // If no persisted state, save the initial state
    const initialState = getState();

    // Process state before saving
    const stateToSave = beforeSave ? beforeSave(initialState) : initialState;

    // Apply partialize if provided
    const finalState = partialize ? (partialize(stateToSave) as T) : stateToSave;
    await storage.setItem(key, { state: finalState, version });
  }

  // Return state save function
  return async (state: T) => {
    // Process state before saving
    const stateToSave = beforeSave ? beforeSave(state) : state;

    // Apply partialize if provided
    const finalState = partialize ? (partialize(stateToSave) as T) : stateToSave;

    await storage.setItem(key, { state: finalState, version });
  };
};

// TODO: 暴露 store api

//
