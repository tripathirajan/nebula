import { useControllableState } from '@nebula-lab/hooks';
import * as React from 'react';

import { DataTableContext } from './data-table-context';

import type { SortDirection } from './data-table-context';

interface DataTableProps extends React.TableHTMLAttributes<HTMLTableElement> {
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

/**
 * `styleless`-tier root of the DataTable compound component — the real
 * behavior extracted from `@nebula-lab/react-ui`'s `DataTable`: sort state
 * (`sortKey`/`sortDirection`, both controllable) and row-selection state
 * (`selected`, also controllable), threaded to every descendant via
 * context. No `@nebula-lab/headless` layer underneath (a sortable `<table>`'s
 * `<th>` already has well-defined native semantics via `aria-sort`, and row
 * selection is just checkboxes — neither needs a bespoke ARIA widget
 * pattern the way `Tree`/`Combobox` do, per the project owner's own
 * decision documented in `AGENTS.md`'s `react-ui` row). No Tailwind classes
 * — plain `className` passthrough, since the root is a single element with
 * nothing else to style.
 *
 * Sorting/filtering the actual row data is left to the consumer (same
 * "consumer owns filtering" convention `Combobox`/`Command` use) — this
 * only tracks *which* column/direction is active and *which* row ids are
 * selected.
 *
 * @example
 * ```tsx
 * <DataTable sortKey={sortKey} sortDirection={sortDirection} onSortChange={(key, dir) => { setSortKey(key); setSortDirection(dir); }}>
 *   ...
 * </DataTable>
 * ```
 */
const DataTable = React.forwardRef<HTMLTableElement, DataTableProps>((props, forwardedRef) => {
  const {
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
      <table {...rest} ref={forwardedRef} />
    </DataTableContext.Provider>
  );
});

DataTable.displayName = 'DataTable';

export { DataTable };
export type { DataTableProps };
