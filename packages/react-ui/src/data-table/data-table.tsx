import { cn } from '@nebula/primitives/cn';
import { DataTable as StylelessDataTable } from '@nebula/styleless/data-table';
import * as React from 'react';

import type { DataTableProps as StylelessDataTableProps } from '@nebula/styleless/data-table';

type DataTableProps = StylelessDataTableProps & { className?: string };

/**
 * Wraps `@nebula/styleless`'s `DataTable` (which owns the real behavior:
 * controllable sort state, controllable row-selection state, both threaded
 * to every descendant via context) and adds only the table's own Tailwind
 * classes — this file's whole job is visual, matching every other
 * `react-ui` wrapper's division of labor with its `styleless` counterpart.
 *
 * `DataTableHeader`/`DataTableBody`/`DataTableCell`/`DataTableCaption` have
 * no matching `styleless` counterpart — inspected and confirmed pure
 * `cn()`-over-`Primitive` wrappers with nothing to decouple (same
 * conclusion `List`/`DescriptionList` already reached). `DataTableRow`/
 * `DataTableHead` do, and are thin wrappers over `styleless`'s versions
 * below. `DataTableSelectionCell`/`DataTableSelectAllCell` stay
 * react-ui-only too — both compose this package's own styled `Checkbox`
 * directly, so there's no meaningful unstyled version of "a `<td>` holding
 * a checked checkbox" one layer down.
 *
 * @example
 * ```tsx
 * <DataTable sortKey={sortKey} sortDirection={sortDirection} onSortChange={(key, dir) => { setSortKey(key); setSortDirection(dir); }}>
 *   <DataTableHeader>
 *     <DataTableRow>
 *       <DataTableSelectAllCell ids={rows.map((r) => r.id)} />
 *       <DataTableHead sortKey="name">Name</DataTableHead>
 *     </DataTableRow>
 *   </DataTableHeader>
 *   <DataTableBody>
 *     {sortedRows.map((row) => (
 *       <DataTableRow key={row.id} id={row.id}>
 *         <DataTableSelectionCell id={row.id} />
 *         <DataTableCell>{row.name}</DataTableCell>
 *       </DataTableRow>
 *     ))}
 *   </DataTableBody>
 * </DataTable>
 * ```
 */
const DataTable = React.forwardRef<HTMLTableElement, DataTableProps>((props, forwardedRef) => {
  const { className, ...rest } = props;
  return (
    <StylelessDataTable
      className={cn('w-full border-collapse text-left text-sm', className)}
      {...rest}
      ref={forwardedRef}
    />
  );
});

DataTable.displayName = 'DataTable';

export { DataTable };
export type { DataTableProps };
