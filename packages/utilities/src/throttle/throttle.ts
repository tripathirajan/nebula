interface ThrottledFunction<Args extends unknown[]> {
  (...args: Args): void;
  cancel: () => void;
}

/**
 * Returns a throttled wrapper around `fn` that runs at most once per `wait`ms.
 * Leading-edge by default (fires immediately on the first call, then ignores
 * calls until the window elapses) — pass `trailing: true` to also fire once
 * more with the last-seen args when the window closes.
 *
 * @param fn - The function to throttle.
 * @param wait - Minimum milliseconds between calls to `fn`. @default 200
 * @param options.trailing - Also invoke `fn` once with the last-seen args when the throttling window closes, if a call was suppressed during it. @default false
 * @returns A throttled function with an extra `.cancel()` method.
 *
 * @example
 * ```ts
 * const onScroll = throttle(() => updateScrollIndicator(), 100);
 * window.addEventListener('scroll', onScroll);
 *
 * // Also fire once more after scrolling stops, with the final position:
 * const onScrollTrailing = throttle(updateScrollIndicator, 100, { trailing: true });
 * ```
 */
function throttle<Args extends unknown[]>(
  fn: (...args: Args) => void,
  wait = 200,
  { trailing = false }: { trailing?: boolean } = {},
): ThrottledFunction<Args> {
  let lastCallTime = 0;
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  let lastArgs: Args | undefined;

  const throttled = (...args: Args) => {
    const now = Date.now();
    const remaining = wait - (now - lastCallTime);

    if (remaining <= 0) {
      lastCallTime = now;
      fn(...args);
    } else if (trailing) {
      lastArgs = args;
      if (timeoutId === undefined) {
        timeoutId = setTimeout(() => {
          lastCallTime = Date.now();
          timeoutId = undefined;
          if (lastArgs) fn(...lastArgs);
          lastArgs = undefined;
        }, remaining);
      }
    }
  };

  throttled.cancel = () => {
    if (timeoutId !== undefined) clearTimeout(timeoutId);
    timeoutId = undefined;
    lastArgs = undefined;
    lastCallTime = 0;
  };

  return throttled;
}

export { throttle };
export type { ThrottledFunction };
