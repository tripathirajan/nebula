import { useVirtualizer } from '@nebula-lab/hooks';
import * as React from 'react';

interface DataGridColumn<T> {
  key: string;
  header: React.ReactNode;
  render: (row: T, index: number) => React.ReactNode;
  /** A CSS `width`/`flex-basis` value, e.g. `'12rem'`. Defaults to sharing remaining space equally with every other column that also omits it. */
  width?: string;
}

interface DataGridClassNames {
  root?: string;
  headerRow?: string;
  headerCell?: string;
  row?: string;
  cell?: string;
}

interface DataGridProps<T> {
  /** The full (virtual) row set — not just the currently visible slice; `useVirtualizer` decides which of these actually render. */
  rows: T[];
  columns: DataGridColumn<T>[];
  /** Best-guess row height (px) before a row's real rendered height is measured — see `useVirtualizer`'s `estimateSize`. @default 40 */
  estimateRowHeight?: number;
  /** Fixed viewport height (px) of the scrollable region. */
  height: number;
  /** Returns a stable id for a row — used as the rendered row's `key` instead of array index, so React doesn't misattribute state across re-sorts/filters. @default (row, index) => index */
  getRowId?: (row: T, index: number) => string | number;
  classNames?: DataGridClassNames;
}

interface DataGridRowProps<T> {
  row: T;
  index: number;
  columns: DataGridColumn<T>[];
  start: number;
  measureElement: (index: number, element: HTMLElement | null) => void;
  className: string | undefined;
  cellClassName: string | undefined;
}

/**
 * One virtualized row, its own component rather than inlined in `.map()` so
 * its `ref` callback (`measureElement`, wired to a `ResizeObserver`) can be
 * `useCallback`-stabilized per row via `index` — an inline
 * `(element) => measureElement(index, element)` created fresh inside a
 * `.map()` gets a new identity every render, which makes React tear down and
 * reattach every *visible* row's `ResizeObserver` on every single re-render
 * of the grid, not just when that row's own content actually changes.
 */
function DataGridRow<T>(props: DataGridRowProps<T>) {
  const { row, index, columns, start, measureElement, className, cellClassName } = props;

  const measureRef = React.useCallback(
    (element: HTMLElement | null) => measureElement(index, element),
    [measureElement, index],
  );

  return (
    <div
      role="row"
      aria-rowindex={index + 1}
      ref={measureRef}
      className={className}
      style={{ position: 'absolute', left: 0, top: 0, width: '100%', transform: `translateY(${start}px)` }}
    >
      {columns.map((column) => (
        <div
          key={column.key}
          role="gridcell"
          className={cellClassName}
          style={column.width ? { flex: `0 0 ${column.width}` } : undefined}
        >
          {column.render(row, index)}
        </div>
      ))}
    </div>
  );
}

/**
 * `styleless`-tier `DataGrid` — the real behavior extracted from
 * `@nebula-lab/react-ui`'s `DataGrid`: composes `@nebula-lab/hooks`' `useVirtualizer`
 * directly (not `DataTable`, whose real un-virtualized `<table>` row model
 * actively resists the absolute positioning virtualized rows need — see
 * that component's own doc comment) and renders the WAI-ARIA Grid pattern
 * over plain `div`s (`role="grid"`/`"row"`/`"columnheader"`/`"gridcell"`),
 * the same accessible alternative real virtualized-grid implementations
 * reach for when a native table's DOM model can't support windowing.
 *
 * The absolute positioning + `transform: translateY(...)` that makes
 * virtualization actually work is baked into this layer's own inline
 * `style` (it's a structural requirement of the technique, not a visual
 * choice) — `classNames` only covers genuinely decorative concerns
 * (background, border, hover, truncation, sizing) that `react-ui`'s
 * version supplies. Sorting/filtering/selection are deliberately not
 * built in here — compose with your own state, the same "consumer owns
 * it" convention `DataTable`/`Combobox` use.
 *
 * @example
 * ```tsx
 * <DataGrid
 *   height={480}
 *   rows={people}
 *   getRowId={(row) => row.id}
 *   columns={[{ key: 'name', header: 'Name', render: (row) => row.name }]}
 * />
 * ```
 */
function DataGrid<T>(props: DataGridProps<T>) {
  const {
    rows,
    columns,
    estimateRowHeight = 40,
    height,
    getRowId = (_row, index) => index,
    classNames,
  } = props;

  const scrollRef = React.useRef<HTMLDivElement>(null);

  // Both stabilized via `useCallback` — passing fresh closures here on every
  // render would make `useVirtualizer`'s scroll/resize-observer effect (keyed
  // on `getScrollElement`) tear down and re-attach every render, and force
  // its O(`rows.length`) `measurements` recomputation (keyed on
  // `estimateSize`) to re-run every render too, even though neither actually
  // changes between renders of this component.
  const getScrollElement = React.useCallback(() => scrollRef.current, []);
  const estimateSize = React.useCallback(() => estimateRowHeight, [estimateRowHeight]);

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement,
    estimateSize,
  });

  return (
    <div
      role="grid"
      aria-rowcount={rows.length}
      aria-colcount={columns.length}
      className={classNames?.root}
    >
      <div role="row" className={classNames?.headerRow}>
        {columns.map((column) => (
          <div
            key={column.key}
            role="columnheader"
            className={classNames?.headerCell}
            style={column.width ? { flex: `0 0 ${column.width}` } : undefined}
          >
            {column.header}
          </div>
        ))}
      </div>
      <div ref={scrollRef} style={{ height, overflow: 'auto' }}>
        <div style={{ height: virtualizer.totalSize, position: 'relative' }}>
          {virtualizer.virtualItems.map((virtualItem) => {
            const row = rows[virtualItem.index];
            if (row === undefined) return null;
            return (
              <DataGridRow
                key={getRowId(row, virtualItem.index)}
                row={row}
                index={virtualItem.index}
                columns={columns}
                start={virtualItem.start}
                measureElement={virtualizer.measureElement}
                className={classNames?.row}
                cellClassName={classNames?.cell}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export { DataGrid };
export type { DataGridProps, DataGridColumn, DataGridClassNames };
