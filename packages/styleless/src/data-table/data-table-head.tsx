import * as React from 'react';

import { useDataTableContext } from './data-table-context';

interface DataTableHeadClassNames {
  th?: string;
  button?: string;
  /** Applied unconditionally — a styled version reads `data-state`/`aria-sort` off the `<th>` itself (or `data-active` below) to vary the icon's own look, same convention `DataTableRow`'s `data-state="selected"` sets. */
  icon?: string;
}

interface DataTableHeadProps extends Omit<React.ThHTMLAttributes<HTMLTableCellElement>, 'className'> {
  /** Makes this column header sortable — clicking (or Enter/Space, since it renders as a real `<button>`) toggles `DataTable`'s sort through `this key`. Omit for a plain, non-sortable column header. */
  sortKey?: string;
  classNames?: DataTableHeadClassNames;
}

/**
 * `styleless`-tier `DataTableHead` — the real behavior extracted from
 * `@nebula-lab/react-ui`'s `DataTableHead`: when `sortKey` is given, wraps
 * `children` in a real `<button>` (a native, keyboard-operable control, not
 * a `<th>` with a hand-rolled click handler) and computes/sets `aria-sort`
 * on the `<th>` itself per the native table-sorting convention (`aria-sort`
 * is a `<th>`-level attribute, not something that belongs on the button
 * inside it). The sort-direction indicator icon is left to the consumer
 * entirely (via `children` after the label, or styled through `react-ui`'s
 * own wrapper) — this layer exposes `data-active`/`data-direction` on the
 * `<th>` so a styled icon can react to them, rather than rendering one
 * itself, since "what the sort indicator looks like" is a pure visual
 * choice with nothing behavioral in it.
 */
const DataTableHead = React.forwardRef<HTMLTableCellElement, DataTableHeadProps>(
  (props, forwardedRef) => {
    const { sortKey, children, classNames, ...rest } = props;
    const context = useDataTableContext('DataTableHead');
    const active = sortKey !== undefined && context.sortKey === sortKey;
    const ariaSort: 'ascending' | 'descending' | 'none' | undefined = !sortKey
      ? undefined
      : active
        ? context.sortDirection === 'asc'
          ? 'ascending'
          : 'descending'
        : 'none';

    return (
      <th
        scope="col"
        aria-sort={ariaSort}
        data-active={active ? '' : undefined}
        data-direction={active ? context.sortDirection : undefined}
        className={classNames?.th}
        {...rest}
        ref={forwardedRef}
      >
        {sortKey ? (
          <button
            type="button"
            onClick={() => context.onSort(sortKey)}
            className={classNames?.button}
          >
            {children}
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className={classNames?.icon}
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
        ) : (
          children
        )}
      </th>
    );
  },
);

DataTableHead.displayName = 'DataTableHead';

export { DataTableHead };
export type { DataTableHeadProps, DataTableHeadClassNames };
