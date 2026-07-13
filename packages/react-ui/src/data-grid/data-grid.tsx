import { cn } from '@nebula/primitives/cn';
import { DataGrid as StylelessDataGrid } from '@nebula/styleless/data-grid';

import type { DataGridColumn, DataGridProps as StylelessDataGridProps } from '@nebula/styleless/data-grid';

type DataGridProps<T> = Omit<StylelessDataGridProps<T>, 'classNames'> & { className?: string };

/**
 * Themed wrapper over `@nebula/styleless`'s `DataGrid` — a virtualized,
 * WAI-ARIA Grid-pattern row/column grid (see that package's own doc comment
 * for why this is a separate component from `DataTable`, not a variant of
 * it: virtualization needs absolutely-positioned rows, which a native
 * `<table>`'s row model resists). This layer only supplies the visual
 * theme — all real state (the virtualizer) lives in `styleless`.
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
  const { className, ...rest } = props;

  return (
    <StylelessDataGrid
      {...rest}
      classNames={{
        root: cn(
          'overflow-hidden rounded-[var(--radius-box)] border border-[var(--data-grid-border)] text-sm text-[var(--data-grid-text)]',
          className,
        ),
        headerRow:
          'flex border-b border-[var(--data-grid-border)] bg-[var(--data-grid-header-bg)] font-medium text-[var(--data-grid-head-text)]',
        headerCell: 'shrink-0 grow truncate px-3 py-2',
        row: 'flex border-b border-[var(--data-grid-border)] hover:bg-[var(--data-grid-row-hover-bg)]',
        cell: 'shrink-0 grow truncate px-3 py-2',
      }}
    />
  );
}

export { DataGrid };
export type { DataGridProps, DataGridColumn };
