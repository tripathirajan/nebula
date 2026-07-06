import { cn } from '@nebula/primitives/cn';
import { Primitive } from '@nebula/primitives/primitive';
import * as React from 'react';

import { useDataTableContext } from './data-table-context';

import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';

interface DataTableHeadOwnProps {
  /** Makes this column header sortable — clicking (or Enter/Space, since it renders as a real `<button>`) toggles `DataTable`'s sort through `this key`. Omit for a plain, non-sortable column header. */
  sortKey?: string;
}

type DataTableHeadProps = PrimitivePropsWithRef<'th'> & DataTableHeadOwnProps;

/**
 * `<th scope="col">` — when `sortKey` is given, wraps its children in a real
 * `<button>` (so it's a native, keyboard-operable control, not a `<th>` with
 * a hand-rolled click handler) and sets `aria-sort` on the `<th>` itself per
 * the native table sorting convention (`aria-sort` is a `<th>`-level
 * attribute, not something that belongs on the button inside it).
 */
const DataTableHead = React.forwardRef<HTMLTableCellElement, DataTableHeadProps>(
  (props, forwardedRef) => {
    const { className, sortKey, children, ...rest } = props;
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
      <Primitive
        as="th"
        scope="col"
        aria-sort={ariaSort}
        className={cn(
          'p-3 text-xs font-medium uppercase tracking-wide text-[var(--data-table-head-text)]',
          className,
        )}
        {...rest}
        ref={forwardedRef}
      >
        {sortKey ? (
          <button
            type="button"
            onClick={() => context.onSort(sortKey)}
            className="flex items-center gap-1 outline-none hover:text-[var(--data-table-text)] focus-visible:ring-2 focus-visible:ring-[var(--data-table-text)]"
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
              className={cn(
                'h-3 w-3 shrink-0 transition-transform',
                active && context.sortDirection === 'desc' ? 'rotate-180' : '',
                active ? 'opacity-100' : 'opacity-30',
              )}
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
        ) : (
          children
        )}
      </Primitive>
    );
  },
);

DataTableHead.displayName = 'DataTableHead';

export { DataTableHead };
export type { DataTableHeadProps };
