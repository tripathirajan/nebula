import { useVirtualizer } from '@nebula/hooks';
import { cn } from '@nebula/primitives/cn';
import * as React from 'react';

interface VirtualListProps<T> {
  /** The full (virtual) item set — not just the currently visible slice; `useVirtualizer` decides which of these actually render. */
  items: T[];
  /** Best-guess row height (px) before a row's real rendered height is measured — see `useVirtualizer`'s `estimateSize`. @default 48 */
  estimateItemHeight?: number;
  /** Fixed viewport height (px) of the scrollable region. */
  height: number;
  /** Returns a stable id for an item — used as the rendered row's `key` instead of array index, so React doesn't misattribute state across re-sorts/filters. @default (item, index) => index */
  getItemId?: (item: T, index: number) => string | number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  itemClassName?: string;
}

interface VirtualListRowProps<T> {
  item: T;
  index: number;
  start: number;
  measureElement: (index: number, element: HTMLElement | null) => void;
  renderItem: (item: T, index: number) => React.ReactNode;
  className: string | undefined;
}

/**
 * One virtualized row, its own component (not inlined in `.map()`) so its
 * `ref` callback can be `useCallback`-stabilized per row — the same fix
 * `@nebula/styleless`'s `DataGrid` needed: an inline
 * `(element) => measureElement(index, element)` created fresh inside
 * `.map()` gets a new identity every render, which makes React tear down
 * and reattach every *visible* row's `ResizeObserver` on every single
 * re-render of the list, not just when that row's own content changes.
 */
function VirtualListRow<T>(props: VirtualListRowProps<T>) {
  const { item, index, start, measureElement, renderItem, className } = props;

  const measureRef = React.useCallback(
    (element: HTMLElement | null) => measureElement(index, element),
    [measureElement, index],
  );

  return (
    <div
      role="listitem"
      ref={measureRef}
      className={className}
      style={{ position: 'absolute', left: 0, top: 0, width: '100%', transform: `translateY(${start}px)` }}
    >
      {renderItem(item, index)}
    </div>
  );
}

/**
 * A virtualized single-column list — composes `@nebula/hooks`' `useVirtualizer`
 * directly, the same "pure windowing math, no ARIA behavior split worth
 * decoupling" project-owner call `DataGrid` documents (no `@nebula/headless`/
 * `@nebula/styleless` layer underneath). Renders `role="list"`/`"listitem"`
 * over plain `div`s rather than a real `<ul>`/`<li>` — a virtualized list's
 * items are absolutely positioned, which breaks native list flow anyway, so
 * this uses the same accessible-role-on-a-div technique `DataGrid` already
 * establishes for `role="grid"` over `div`s.
 *
 * Reach for `VirtualList` when a plain `List`/`ListItem` would render
 * thousands of rows into the DOM at once (a large transaction/notification/
 * search-result feed); for anything under a few hundred items, a plain
 * `List` is simpler and doesn't need a fixed `height`.
 *
 * @example
 * ```tsx
 * <VirtualList
 *   height={480}
 *   items={transactions}
 *   getItemId={(item) => item.id}
 *   renderItem={(item) => <TransactionRow transaction={item} />}
 * />
 * ```
 */
function VirtualList<T>(props: VirtualListProps<T>) {
  const {
    items,
    estimateItemHeight = 48,
    height,
    getItemId = (_item, index) => index,
    renderItem,
    className,
    itemClassName,
  } = props;

  const scrollRef = React.useRef<HTMLDivElement>(null);

  // Stabilized via `useCallback` for the same reason `DataGrid` needs it —
  // fresh closures here every render would make `useVirtualizer`'s scroll/
  // resize-observer effect tear down and re-attach every render, and force
  // its O(`items.length`) `measurements` recomputation to re-run every
  // render too.
  const getScrollElement = React.useCallback(() => scrollRef.current, []);
  const estimateSize = React.useCallback(() => estimateItemHeight, [estimateItemHeight]);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement,
    estimateSize,
  });

  return (
    <div
      ref={scrollRef}
      role="list"
      className={cn('text-[var(--list-text)]', className)}
      style={{ height, overflow: 'auto' }}
    >
      <div style={{ height: virtualizer.totalSize, position: 'relative' }}>
        {virtualizer.virtualItems.map((virtualItem) => {
          const item = items[virtualItem.index];
          if (item === undefined) return null;
          return (
            <VirtualListRow
              key={getItemId(item, virtualItem.index)}
              item={item}
              index={virtualItem.index}
              start={virtualItem.start}
              measureElement={virtualizer.measureElement}
              renderItem={renderItem}
              className={itemClassName}
            />
          );
        })}
      </div>
    </div>
  );
}

export { VirtualList };
export type { VirtualListProps };
