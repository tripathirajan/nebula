/**
 * Returns a function with a stable identity across renders that always
 * calls the latest `callback` — lets you omit a frequently-changing callback
 * from a `useEffect`/`useMemo` dependency array without going stale or
 * re-running the effect every render.
 *
 * @typeParam Args - The callback's parameter types.
 * @typeParam R - The callback's return type.
 * @param callback - The (possibly frequently-changing) callback to stabilize.
 * @returns A stable function that always invokes the latest `callback`.
 *
 * @example
 * ```tsx
 * function useEventListener(eventName: string, handler: (e: Event) => void) {
 *   const stableHandler = useStableCallback(handler);
 *   useEffect(() => {
 *     // `stableHandler` never changes identity, so this effect only
 *     // re-runs when `eventName` does, even if `handler` is a fresh
 *     // inline function every render.
 *     window.addEventListener(eventName, stableHandler);
 *     return () => window.removeEventListener(eventName, stableHandler);
 *   }, [eventName, stableHandler]);
 * }
 * ```
 */
declare function useStableCallback<Args extends unknown[], R>(callback: (...args: Args) => R): (...args: Args) => R;
export { useStableCallback };
//# sourceMappingURL=use-stable-callback.d.ts.map