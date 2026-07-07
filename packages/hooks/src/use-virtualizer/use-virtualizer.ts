import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface VirtualItem {
  /** This item's position in the full `count`-length list. */
  index: number;
  /** Offset (px) from the start of the virtualized content — i.e. *before* `scrollMargin` is added back in, since that offset lives in the scroll container's own coordinate space, not this hook's. */
  start: number;
  /** This item's current size (px) — `estimateSize(index)` until `measureElement` reports a real one. */
  size: number;
}

interface UseVirtualizerOptions {
  /** Total number of items in the (virtual) list — not how many are actually rendered. */
  count: number;
  /** Returns the element being scrolled — a ref's `.current` read at measure-time, not the ref itself, so this hook doesn't need to know how the consumer stores it. */
  getScrollElement: () => HTMLElement | null;
  /** Best-guess size (px) for an item that hasn't been measured yet. For a fixed-height list this *is* the real size and `measureElement` never needs to run. */
  estimateSize: (index: number) => number;
  /** Extra items rendered on each side of the visible window, so fast scrolling/keyboard navigation doesn't flash empty space before the next paint. @default 5 */
  overscan?: number;
  /** Distance (px) between the scroll element's own top and where the virtualized content actually starts — e.g. a heading rendered above the list inside the same scroll container. Only affects `scrollToIndex`'s math; doesn't affect `virtualItems`' offsets, which stay in the virtualizer's own coordinate space. @default 0 */
  scrollMargin?: number;
}

interface Virtualizer {
  /** Only the items currently in (or near, via `overscan`) the visible window — render exactly these, absolutely positioned at `item.start`, inside a container sized to `totalSize`. */
  virtualItems: VirtualItem[];
  /** The full list's total size (px) — size the scrollable spacer to this so the scrollbar behaves as if every item were actually rendered. */
  totalSize: number;
  /** Attach to each rendered item's root element (e.g. `ref={(el) => virtualizer.measureElement(item.index, el)}`) to replace `estimateSize`'s guess with the item's real rendered height once known — needed for variable-size content; a no-op to skip for a genuinely fixed-size list. */
  measureElement: (index: number, element: HTMLElement | null) => void;
  /** Scrolls the container so item `index` is visible, accounting for `scrollMargin`. */
  scrollToIndex: (index: number, options?: { align?: 'start' | 'center' | 'end' }) => void;
}

/**
 * List virtualization — computes which of `count` items actually fall (plus
 * `overscan`) inside the scroll element's visible window, so a consumer only
 * renders those instead of the full list. Deliberately a plain hook, not a
 * `headless`/`react-ui` component: unlike everything else in this project,
 * windowing math has no ARIA semantics of its own to separate from styling —
 * it's the same "just state, no behavior worth a compound component" call
 * this project made for `useControllableState` (see project owner decision
 * in `AGENTS.md`'s `react-ui` row; `react-ui`'s own `Virtualizer`-flavored
 * components, if any, would be thin consumers of this hook, not a
 * replacement for it).
 *
 * Supports variable-size content via `measureElement` — sizes start as
 * `estimateSize`'s guess and are corrected in place (without a full re-scroll
 * jump) once each item's real rendered size is known, the same "estimate,
 * then measure and correct" strategy TanStack Virtual/react-window use.
 *
 * @example
 * ```tsx
 * function VirtualList({ items }: { items: string[] }) {
 *   const scrollRef = useRef<HTMLDivElement>(null);
 *   const virtualizer = useVirtualizer({
 *     count: items.length,
 *     getScrollElement: () => scrollRef.current,
 *     estimateSize: () => 40,
 *   });
 *
 *   return (
 *     <div ref={scrollRef} style={{ height: 400, overflow: 'auto' }}>
 *       <div style={{ height: virtualizer.totalSize, position: 'relative' }}>
 *         {virtualizer.virtualItems.map((virtualItem) => (
 *           <div
 *             key={virtualItem.index}
 *             ref={(el) => virtualizer.measureElement(virtualItem.index, el)}
 *             style={{
 *               position: 'absolute',
 *               top: 0,
 *               left: 0,
 *               width: '100%',
 *               transform: `translateY(${virtualItem.start}px)`,
 *             }}
 *           >
 *             {items[virtualItem.index]}
 *           </div>
 *         ))}
 *       </div>
 *     </div>
 *   );
 * }
 * ```
 */
function useVirtualizer(options: UseVirtualizerOptions): Virtualizer {
  const { count, getScrollElement, estimateSize, overscan = 5, scrollMargin = 0 } = options;

  const [scrollOffset, setScrollOffset] = useState(0);
  const [viewportSize, setViewportSize] = useState(0);
  // Bumped whenever a measured size changes, to force the memoized
  // `measurements` array below to recompute — the sizes themselves live in a
  // ref (not state) since a measurement can arrive for any item at any time
  // and shouldn't each independently trigger their own full recalculation pass.
  const [measurementVersion, setMeasurementVersion] = useState(0);
  const sizeCache = useRef<Map<number, number>>(new Map());
  const resizeObserversRef = useRef<Map<number, ResizeObserver>>(new Map());

  useEffect(() => {
    const element = getScrollElement();
    if (!element) return;

    const onScroll = () => setScrollOffset(element.scrollTop);
    onScroll();
    element.addEventListener('scroll', onScroll, { passive: true });

    let resizeObserver: ResizeObserver | undefined;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(([entry]) => {
        if (entry) setViewportSize(entry.contentRect.height);
      });
      resizeObserver.observe(element);
    } else {
      setViewportSize(element.clientHeight);
    }

    return () => {
      element.removeEventListener('scroll', onScroll);
      resizeObserver?.disconnect();
    };
  }, [getScrollElement]);

  const measurements = useMemo(() => {
    const result: { start: number; size: number }[] = [];
    let cursor = 0;
    for (let index = 0; index < count; index += 1) {
      const size = sizeCache.current.get(index) ?? estimateSize(index);
      result.push({ start: cursor, size });
      cursor += size;
    }
    return result;
    // `measurementVersion` is a deliberate extra dependency purely to force
    // recomputation when `sizeCache` (a ref, so not itself trackable) changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, estimateSize, measurementVersion]);

  const totalSize = measurements.length > 0
    ? measurements[measurements.length - 1]!.start + measurements[measurements.length - 1]!.size
    : 0;

  const virtualItems = useMemo<VirtualItem[]>(() => {
    if (measurements.length === 0 || viewportSize === 0) return [];

    const viewportStart = scrollOffset;
    const viewportEnd = scrollOffset + viewportSize;

    let startIndex = measurements.findIndex((m) => m.start + m.size > viewportStart);
    if (startIndex === -1) startIndex = 0;
    let endIndex = measurements.findIndex((m) => m.start >= viewportEnd);
    if (endIndex === -1) endIndex = measurements.length - 1;

    const overscanStart = Math.max(0, startIndex - overscan);
    const overscanEnd = Math.min(measurements.length - 1, endIndex + overscan);

    const items: VirtualItem[] = [];
    for (let index = overscanStart; index <= overscanEnd; index += 1) {
      const measurement = measurements[index]!;
      items.push({ index, start: measurement.start, size: measurement.size });
    }
    return items;
  }, [measurements, scrollOffset, viewportSize, overscan]);

  const measureElement = useCallback((index: number, element: HTMLElement | null) => {
    const existingObserver = resizeObserversRef.current.get(index);
    existingObserver?.disconnect();
    resizeObserversRef.current.delete(index);

    if (!element) return;

    const applySize = (size: number) => {
      if (sizeCache.current.get(index) === size) return;
      sizeCache.current.set(index, size);
      setMeasurementVersion((v) => v + 1);
    };

    if (typeof ResizeObserver === 'undefined') {
      applySize(element.getBoundingClientRect().height);
      return;
    }

    const observer = new ResizeObserver(([entry]) => {
      if (entry) applySize(entry.contentRect.height);
    });
    observer.observe(element);
    resizeObserversRef.current.set(index, observer);
  }, []);

  useEffect(
    () => () => {
      for (const observer of resizeObserversRef.current.values()) observer.disconnect();
      resizeObserversRef.current.clear();
    },
    [],
  );

  const scrollToIndex = useCallback(
    (index: number, scrollToOptions?: { align?: 'start' | 'center' | 'end' }) => {
      const element = getScrollElement();
      const measurement = measurements[index];
      if (!element || !measurement) return;

      const align = scrollToOptions?.align ?? 'start';
      let top = measurement.start + scrollMargin;
      if (align === 'center') {
        top = measurement.start + scrollMargin - viewportSize / 2 + measurement.size / 2;
      } else if (align === 'end') {
        top = measurement.start + scrollMargin - viewportSize + measurement.size;
      }
      element.scrollTo({ top: Math.max(0, top) });
    },
    [getScrollElement, measurements, scrollMargin, viewportSize],
  );

  return { virtualItems, totalSize, measureElement, scrollToIndex };
}

export { useVirtualizer };
export type { VirtualItem, UseVirtualizerOptions, Virtualizer };
