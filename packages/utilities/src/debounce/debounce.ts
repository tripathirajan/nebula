interface DebouncedFunction<Args extends unknown[]> {
  (...args: Args): void;
  /** Cancel a pending invocation without calling `fn`. */
  cancel: () => void;
  /** Invoke `fn` immediately with the most recent args, if one is pending. */
  flush: () => void;
}

/**
 * Returns a debounced wrapper around `fn` that only runs after `wait`ms have
 * elapsed since the last call. Trailing-edge only (fires once activity
 * settles) — for a leading-edge/throttled variant see `throttle`.
 *
 * @param fn - The function to debounce.
 * @param wait - Milliseconds of inactivity required before `fn` runs. @default 200
 * @returns A debounced function with extra `.cancel()` and `.flush()` methods.
 *
 * @example
 * ```ts
 * const search = debounce((query: string) => api.search(query), 300);
 *
 * input.addEventListener('input', (e) => search((e.target as HTMLInputElement).value));
 *
 * // On unmount, drop any pending call instead of letting it fire late:
 * search.cancel();
 * ```
 */
function debounce<Args extends unknown[]>(
  fn: (...args: Args) => void,
  wait = 200,
): DebouncedFunction<Args> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  let lastArgs: Args | undefined;

  const debounced = (...args: Args) => {
    lastArgs = args;
    if (timeoutId !== undefined) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      timeoutId = undefined;
      if (lastArgs) fn(...lastArgs);
      lastArgs = undefined;
    }, wait);
  };

  debounced.cancel = () => {
    if (timeoutId !== undefined) clearTimeout(timeoutId);
    timeoutId = undefined;
    lastArgs = undefined;
  };

  debounced.flush = () => {
    if (timeoutId !== undefined) clearTimeout(timeoutId);
    timeoutId = undefined;
    if (lastArgs) fn(...lastArgs);
    lastArgs = undefined;
  };

  return debounced;
}

export { debounce };
export type { DebouncedFunction };
