import { useVirtualizer } from '@nebula/hooks';
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

/**
 * `styleless`-tier `DataGrid` — the real behavior extracted from
 * `@nebula/react-ui`'s `DataGrid`: composes `@nebula/hooks`' `useVirtualizer`
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

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => estimateRowHeight,
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
              <div
                key={getRowId(row, virtualItem.index)}
                role="row"
                aria-rowindex={virtualItem.index + 1}
                ref={(element) => virtualizer.measureElement(virtualItem.index, element)}
                className={classNames?.row}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: '100%',
                  transform: `translateY(${virtualItem.start}px)`,
                }}
              >
                {columns.map((column) => (
                  <div
                    key={column.key}
                    role="gridcell"
                    className={classNames?.cell}
                    style={column.width ? { flex: `0 0 ${column.width}` } : undefined}
                  >
                    {column.render(row, virtualItem.index)}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export { DataGrid };
export type { DataGridProps, DataGridColumn, DataGridClassNames };
