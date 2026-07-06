import { useVirtualizer } from '@nebula/hooks';
import { cn } from '@nebula/primitives/cn';
import * as React from 'react';

interface DataGridColumn<T> {
  key: string;
  header: React.ReactNode;
  render: (row: T, index: number) => React.ReactNode;
  /** A CSS `width`/`flex-basis` value, e.g. `'12rem'`. Defaults to sharing remaining space equally with every other column that also omits it. */
  width?: string;
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
  className?: string;
}

/**
 * A virtualized row/column grid — composes `@nebula/hooks`' `useVirtualizer`
 * directly rather than `DataTable`, which is a real, un-virtualized native
 * `<table>` (see that component's own doc comment on why virtualizing a
 * native `<table>`'s row model is awkward: virtualized rows need absolute
 * positioning, which a `<tbody>`/`<tr>` structure actively resists). Instead
 * renders the WAI-ARIA Grid pattern directly over plain `div`s
 * (`role="grid"`/`"row"`/`"columnheader"`/`"gridcell"`) — the same
 * accessible alternative real virtualized-grid implementations (AG Grid,
 * MUI's `DataGrid`) reach for when a native table's DOM model can't support
 * windowing. Column headers render once, outside the scrolling region
 * (never virtualized — there just aren't enough of them to matter); rows
 * are absolutely positioned at `virtualItem.start` inside a spacer sized to
 * `totalSize`, so the scrollbar behaves as if every row were rendered.
 * Sorting/filtering/selection are deliberately not built in here — compose
 * with your own state (or `DataTable`'s, if you don't need virtualization)
 * the same "consumer owns it" convention `DataTable`/`Combobox` use.
 *
 * @example
 * ```tsx
 * <DataGrid
 *   height={480}
 *   rows={people}
 *   getRowId={(row) => row.id}
 *   columns={[
 *     { key: 'name', header: 'Name', render: (row) => row.name, width: '12rem' },
 *     { key: 'email', header: 'Email', render: (row) => row.email },
 *   ]}
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
    className,
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
      className={cn(
        'overflow-hidden rounded-[var(--radius-box)] border border-[var(--data-grid-border)] text-sm text-[var(--data-grid-text)]',
        className,
      )}
    >
      <div
        role="row"
        className="flex border-b border-[var(--data-grid-border)] bg-[var(--data-grid-header-bg)] font-medium text-[var(--data-grid-head-text)]"
      >
        {columns.map((column) => (
          <div
            key={column.key}
            role="columnheader"
            className="shrink-0 grow truncate px-3 py-2"
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
                className="absolute left-0 top-0 flex w-full border-b border-[var(--data-grid-border)] hover:bg-[var(--data-grid-row-hover-bg)]"
                style={{ transform: `translateY(${virtualItem.start}px)` }}
              >
                {columns.map((column) => (
                  <div
                    key={column.key}
                    role="gridcell"
                    className="shrink-0 grow truncate px-3 py-2"
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
export type { DataGridProps, DataGridColumn };
