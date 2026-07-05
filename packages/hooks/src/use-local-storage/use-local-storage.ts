import { useCallback, useEffect, useState } from 'react';

import type { Dispatch, SetStateAction } from 'react';

/**
 * `useState` backed by `localStorage`, synced across tabs/windows via the
 * `storage` event. Falls back to in-memory-only state (no throw) when
 * `localStorage` is unavailable — SSR, privacy mode, storage quota errors.
 *
 * @typeParam T - The stored value's type — must be JSON-serializable.
 * @param key - The `localStorage` key.
 * @param initialValue - The value (or a lazy initializer) used when nothing's stored yet.
 * @returns A `[value, setValue]` pair, same shape as `useState`.
 *
 * @example
 * ```tsx
 * const [theme, setTheme] = useLocalStorage<'light' | 'dark' | 'system'>('nebula-theme', 'system');
 * ```
 */
function useLocalStorage<T>(
  key: string,
  initialValue: T | (() => T),
): [T, Dispatch<SetStateAction<T>>] {
  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') {
      return initialValue instanceof Function ? initialValue() : initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      if (item !== null) return JSON.parse(item) as T;
    } catch {
      // fall through to initialValue on parse/access errors
    }
    return initialValue instanceof Function ? initialValue() : initialValue;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const [storedValue, setStoredValue] = useState<T>(readValue);

  const setValue: Dispatch<SetStateAction<T>> = useCallback(
    (value) => {
      setStoredValue((current) => {
        const next = value instanceof Function ? value(current) : value;
        try {
          if (typeof window !== 'undefined') {
            window.localStorage.setItem(key, JSON.stringify(next));
          }
        } catch {
          // quota exceeded / storage disabled — keep the in-memory value
        }
        return next;
      });
    },
    [key],
  );

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === key) setStoredValue(readValue());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [key, readValue]);

  return [storedValue, setValue];
}

export { useLocalStorage };
