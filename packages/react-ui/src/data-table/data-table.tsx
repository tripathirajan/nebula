import { useControllableState } from '@nebula/hooks';
import { cn } from '@nebula/primitives/cn';
import { Primitive } from '@nebula/primitives/primitive';
import * as React from 'react';

import { DataTableContext } from './data-table-context';

import type { SortDirection } from './data-table-context';
import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';

interface DataTableOwnProps {
  /** Controlled: which column key is currently sorted. */
  sortKey?: string;
  defaultSortKey?: string;
  /** Controlled: the current sort direction — ignored/reset to `'asc'` whenever `sortKey` changes to a different column. */
  sortDirection?: SortDirection;
  defaultSortDirection?: SortDirection;
  onSortChange?: (key: string, direction: SortDirection) => void;
  /** Controlled: selected row ids. */
  selected?: string[];
  defaultSelected?: string[];
  onSelectedChange?: (ids: string[]) => void;
}

type DataTableProps = PrimitivePropsWithRef<'table'> & DataTableOwnProps;

/**
 * Root of the DataTable compound component — a real `<table>` plus sort and
 * row-selection *state*, not an independent ARIA behavior layer, which is
 * why (per the project owner decision in `AGENTS.md`'s `react-ui` row) this
 * has no separate `@nebula/headless` primitive underneath it: sortable
 * column headers already have well-defined native semantics
 * (`aria-sort` on a native `<table>`'s `<th>`) and row selection is just
 * checkboxes, neither of which needs a bespoke widget pattern the way
 * `Tree`/`Combobox`/etc. do.
 *
 * Sorting/filtering the actual row data is left to the consumer (same
 * "consumer owns filtering" convention `Combobox`/`Command` use) — this only
 * tracks *which* column/direction is active and *which* row ids are
 * selected; `DataTableHead`'s `onSort` callback and this component's
 * `onSortChange` are what a consumer wires to their own sort function.
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
  const {
    className,
    sortKey: sortKeyProp,
    defaultSortKey,
    sortDirection: sortDirectionProp,
    defaultSortDirection = 'asc',
    onSortChange,
    selected: selectedProp,
    defaultSelected = [],
    onSelectedChange,
    ...rest
  } = props;

  const [sortKey, setSortKey] = useControllableState<string | undefined>({
    prop: sortKeyProp,
    defaultProp: defaultSortKey,
    onChange: undefined,
  });
  const [sortDirection, setSortDirection] = useControllableState<SortDirection>({
    prop: sortDirectionProp,
    defaultProp: defaultSortDirection,
    onChange: undefined,
  });
  const [selected, setSelected] = useControllableState<string[]>({
    prop: selectedProp,
    defaultProp: defaultSelected,
    onChange: onSelectedChange,
  });

  const onSort = React.useCallback(
    (key: string) => {
      const nextDirection: SortDirection =
        key === sortKey && sortDirection === 'asc' ? 'desc' : key === sortKey ? 'asc' : 'asc';
      setSortKey(key);
      setSortDirection(nextDirection);
      onSortChange?.(key, nextDirection);
    },
    [sortKey, sortDirection, setSortKey, setSortDirection, onSortChange],
  );

  const selectedSet = React.useMemo(() => new Set(selected ?? []), [selected]);

  const isSelected = React.useCallback((id: string) => selectedSet.has(id), [selectedSet]);

  const toggleSelected = React.useCallback(
    (id: string) => {
      setSelected((current) => {
        const currentIds = current ?? [];
        return currentIds.includes(id)
          ? currentIds.filter((existing) => existing !== id)
          : [...currentIds, id];
      });
    },
    [setSelected],
  );

  const contextValue = React.useMemo(
    () => ({
      sortKey,
      sortDirection: sortDirection ?? defaultSortDirection,
      onSort,
      isSelected,
      toggleSelected,
      setSelected: (ids: string[]) => setSelected(ids),
      selected: selected ?? defaultSelected,
    }),
    [sortKey, sortDirection, defaultSortDirection, onSort, isSelected, toggleSelected, setSelected, selected, defaultSelected],
  );

  return (
    <DataTableContext.Provider value={contextValue}>
      <Primitive
        as="table"
        className={cn('w-full border-collapse text-left text-sm', className)}
        {...rest}
        ref={forwardedRef}
      />
    </DataTableContext.Provider>
  );
});

DataTable.displayName = 'DataTable';

export { DataTable };
export type { DataTableProps };
