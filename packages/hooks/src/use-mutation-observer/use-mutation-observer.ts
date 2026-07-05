import { useEffect } from 'react';

import type { RefObject } from 'react';

/**
 * Observes DOM mutations (attribute/child-list/subtree changes) on `ref`'s
 * node via `MutationObserver` and calls `callback` with each batch of
 * records — for reacting to DOM changes an app doesn't control directly
 * (a third-party widget injecting nodes, a contenteditable region, watching
 * for a class/attribute another script toggles).
 *
 * @param ref - The element to observe.
 * @param callback - Called with each `MutationRecord[]` batch and the observer instance itself (handy for calling `observer.disconnect()` from inside the callback).
 * @param options - Standard `MutationObserverInit` — at least one of `attributes`/`childList`/`characterData` (with `subtree` if needed) must be `true` or the browser throws.
 *
 * @example
 * ```tsx
 * function WatchClassChanges() {
 *   const ref = useRef<HTMLDivElement>(null);
 *   useMutationObserver(ref, (mutations) => {
 *     for (const mutation of mutations) {
 *       if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
 *         console.log('class changed:', (mutation.target as HTMLElement).className);
 *       }
 *     }
 *   }, { attributes: true });
 *
 *   return <div ref={ref} />;
 * }
 * ```
 */
function useMutationObserver<T extends Element>(
  ref: RefObject<T>,
  callback: (mutations: MutationRecord[], observer: MutationObserver) => void,
  options: MutationObserverInit = { attributes: true, childList: true, subtree: true },
): void {
  useEffect(() => {
    const element = ref.current;
    if (!element || typeof MutationObserver === 'undefined') return;

    const observer = new MutationObserver(callback);
    observer.observe(element, options);
    return () => observer.disconnect();
    // `options` is an object literal at most call sites, so it's excluded
    // from deps (would re-subscribe every render) — pass a stable
    // reference if you need it to react to option changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, callback]);
}

export { useMutationObserver };
