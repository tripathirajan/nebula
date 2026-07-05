/**
 * Returns a debounced copy of `value` that only updates after `delay`ms have
 * passed without `value` changing. For debouncing a callback instead of a
 * value, use `debounce()` from `@nebula/utilities` directly.
 *
 * @typeParam T - The value's type.
 * @param value - The value to debounce.
 * @param delay - Milliseconds of stability required before the debounced value updates. @default 200
 * @returns The debounced value.
 *
 * @example
 * ```tsx
 * function SearchBox() {
 *   const [query, setQuery] = useState('');
 *   const debouncedQuery = useDebounce(query, 300);
 *
 *   useEffect(() => {
 *     if (debouncedQuery) api.search(debouncedQuery);
 *   }, [debouncedQuery]);
 *
 *   return <input value={query} onChange={(e) => setQuery(e.target.value)} />;
 * }
 * ```
 */
declare function useDebounce<T>(value: T, delay?: number): T;
export { useDebounce };
//# sourceMappingURL=use-debounce.d.ts.map