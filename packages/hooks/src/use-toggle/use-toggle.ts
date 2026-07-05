import { useCallback, useState } from 'react';

/**
 * Generic toggle state over any two-value set, not just booleans — e.g.
 * `useToggle(['list', 'grid'])` for a view switcher. Defaults to plain
 * boolean toggling when called with no arguments.
 *
 * @typeParam T - The toggled value's type. @default boolean
 * @param values - The `[first, second]` pair to toggle between. @default [false, true]
 * @returns A `[value, toggle, setValue]` tuple — `toggle` flips between the two values; `setValue` jumps to a specific one.
 *
 * @example
 * ```tsx
 * const [view, toggleView] = useToggle(['list', 'grid'] as const);
 * <button onClick={toggleView}>Switch to {view === 'list' ? 'grid' : 'list'} view</button>
 *
 * // Plain boolean toggling:
 * const [isOpen, toggleOpen] = useToggle();
 * ```
 */
function useToggle<T = boolean>(
  values: readonly [T, T] = [false, true] as unknown as readonly [T, T],
): [T, () => void, (value: T) => void] {
  const [first, second] = values;
  const [state, setState] = useState<T>(first);

  const toggle = useCallback(() => {
    setState((current) => (current === first ? second : first));
  }, [first, second]);

  return [state, toggle, setState];
}

export { useToggle };
