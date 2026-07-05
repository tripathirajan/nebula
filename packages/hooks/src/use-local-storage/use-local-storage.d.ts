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
declare function useLocalStorage<T>(key: string, initialValue: T | (() => T)): [T, Dispatch<SetStateAction<T>>];
export { useLocalStorage };
//# sourceMappingURL=use-local-storage.d.ts.map