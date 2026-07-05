/**
 * Returns the value `value` held during the previous render (`undefined` on
 * the first render). Useful for diffing props/state to decide whether to
 * fire an animation, log a transition, etc.
 *
 * @typeParam T - The value's type.
 * @param value - The current value.
 * @returns `value` as of the previous render, or `undefined` on the first render.
 *
 * @example
 * ```tsx
 * function Value({ count }: { count: number }) {
 *   const previousCount = usePrevious(count);
 *   const direction = previousCount === undefined ? null : count > previousCount ? 'up' : 'down';
 *   return <span data-direction={direction}>{count}</span>;
 * }
 * ```
 */
declare function usePrevious<T>(value: T): T | undefined;
export { usePrevious };
//# sourceMappingURL=use-previous.d.ts.map