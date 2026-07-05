import type { Ref, RefCallback } from 'react';
type PossibleRef<T> = Ref<T> | undefined;
/**
 * Composes multiple refs (callback or object) into a single ref callback so a
 * component can forward its own ref while also capturing one internally.
 *
 * React 19's callback refs may return a cleanup function; we support that
 * while remaining compatible with React 18's fire-and-forget callback refs.
 *
 * @param refs - Any mix of callback refs, object refs (`useRef()` results), or `undefined`/`null`.
 * @returns A single ref callback that updates every ref in `refs` with the same node.
 *
 * @example
 * ```tsx
 * const Input = forwardRef<HTMLInputElement>((props, forwardedRef) => {
 *   const localRef = useRef<HTMLInputElement>(null);
 *   // Both `forwardedRef` (from the consumer) and `localRef` (used
 *   // internally, e.g. to call .focus()) get the same DOM node.
 *   return <input {...props} ref={composeRefs(forwardedRef, localRef)} />;
 * });
 * ```
 */
declare function composeRefs<T>(...refs: PossibleRef<T>[]): RefCallback<T>;
/**
 * A memoized version of `composeRefs` safe to call inside render — the
 * returned ref callback identity is stable across renders as long as the
 * input refs are.
 *
 * @param refs - Same as {@link composeRefs}.
 * @returns A memoized composed ref callback.
 *
 * @example
 * ```tsx
 * const composedRef = useComposedRefs(forwardedRef, localRef);
 * return <div ref={composedRef} />;
 * ```
 */
declare function useComposedRefs<T>(...refs: PossibleRef<T>[]): RefCallback<T>;
export { composeRefs, useComposedRefs };
export type { PossibleRef };
//# sourceMappingURL=compose-refs.d.ts.map