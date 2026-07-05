import { useCallback } from 'react';

import type { Ref, RefCallback } from 'react';

type PossibleRef<T> = Ref<T> | undefined;

/**
 * Sets a given ref to a value, handling both callback refs and object refs.
 *
 * Return type is asserted rather than inferred: `@types/react`'s
 * `RefCallback` return type is intentionally unusable (an indexed access
 * into an empty interface, so it resolves to `void`) to stop people from
 * accidentally relying on a callback ref's return value — but React 19
 * callback refs *do* support returning a cleanup function at runtime, which
 * is what `composeRefs` below needs to detect.
 */
function setRef<T>(ref: PossibleRef<T>, value: T): void | (() => void) {
  if (typeof ref === 'function') {
    return ref(value) as void | (() => void);
  } else if (ref !== null && ref !== undefined) {
    (ref as React.MutableRefObject<T>).current = value;
  }
}

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
function composeRefs<T>(...refs: PossibleRef<T>[]): RefCallback<T> {
  return (node) => {
    let hasCleanup = false;
    const cleanups = refs.map((ref) => {
      const cleanup = setRef(ref, node);
      if (!hasCleanup && typeof cleanup === 'function') {
        hasCleanup = true;
      }
      return cleanup;
    });

    // React <19 will log an error if any callback returns a value other than
    // a cleanup function, so we only return one here if it's actually needed.
    if (hasCleanup) {
      return () => {
        for (let i = 0; i < cleanups.length; i++) {
          const cleanup = cleanups[i];
          if (typeof cleanup === 'function') {
            cleanup();
          } else {
            setRef(refs[i], null);
          }
        }
      };
    }
  };
}

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
function useComposedRefs<T>(...refs: PossibleRef<T>[]): RefCallback<T> {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(composeRefs(...refs), refs);
}

export { composeRefs, useComposedRefs };
export type { PossibleRef };
