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
declare function useIntersectionObserver<T extends HTMLElement>(ref: RefObject<T>, options?: IntersectionObserverInit): IntersectionObserverEntry | undefined;
export { useIntersectionObserver };
//# sourceMappingURL=use-intersection-observer.d.ts.map