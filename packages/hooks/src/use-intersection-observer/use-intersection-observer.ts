import { useEffect, useState } from 'react';

import type { RefObject } from 'react';

/**
 * Observes `ref` via `IntersectionObserver` and returns the latest
 * `IntersectionObserverEntry` (`undefined` until the first observation
 * fires). Used for scroll-triggered reveal, infinite-scroll sentinels, lazy
 * image loading, etc.
 *
 * @typeParam T - The observed element's type.
 * @param ref - The element to observe.
 * @param options - Standard `IntersectionObserverInit` (`root`, `rootMargin`, `threshold`).
 * @returns The latest `IntersectionObserverEntry`, or `undefined` before the first observation.
 *
 * @example
 * ```tsx
 * function LazyImage({ src }: { src: string }) {
 *   const ref = useRef<HTMLDivElement>(null);
 *   const entry = useIntersectionObserver(ref, { threshold: 0.1 });
 *   return <div ref={ref}>{entry?.isIntersecting ? <img src={src} /> : null}</div>;
 * }
 * ```
 */
function useIntersectionObserver<T extends HTMLElement>(
  ref: RefObject<T>,
  options?: IntersectionObserverInit,
): IntersectionObserverEntry | undefined {
  const [entry, setEntry] = useState<IntersectionObserverEntry>();
  // stringify to keep the effect from re-running every render when callers
  // pass a fresh options object literal
  const optionsKey = JSON.stringify({
    root: undefined,
    rootMargin: options?.rootMargin,
    threshold: options?.threshold,
  });

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(([observedEntry]) => {
      if (observedEntry) setEntry(observedEntry);
    }, options);

    observer.observe(element);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, optionsKey]);

  return entry;
}

export { useIntersectionObserver };
