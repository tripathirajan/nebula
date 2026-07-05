import type { RefObject } from 'react';
interface Size {
    width: number;
    height: number;
}
/**
 * Observes `ref`'s content-box size via `ResizeObserver` and returns the
 * latest `{ width, height }` (both `undefined` until the first observation
 * fires). Used for e.g. `AspectRatio`/chart containers that need to react
 * to their own size rather than the viewport's.
 *
 * @typeParam T - The observed element's type.
 * @param ref - The element to observe.
 * @returns `{ width, height }` (content-box, in CSS pixels) — both keys absent until the first observation fires.
 *
 * @example
 * ```tsx
 * function ResponsiveChart() {
 *   const ref = useRef<HTMLDivElement>(null);
 *   const { width, height } = useResizeObserver(ref);
 *   return <div ref={ref}>{width && height ? <Chart width={width} height={height} /> : null}</div>;
 * }
 * ```
 */
declare function useResizeObserver<T extends HTMLElement>(ref: RefObject<T>): Partial<Size>;
export { useResizeObserver };
export type { Size };
//# sourceMappingURL=use-resize-observer.d.ts.map