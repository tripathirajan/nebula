import { cn } from '@nebula/primitives/cn';
import { Primitive } from '@nebula/primitives/primitive';
import * as React from 'react';

import { useDataTableContext } from './data-table-context';

import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';

interface DataTableRowOwnProps {
  /** This row's selection id — omit for a header row, which is never selectable itself. */
  id?: string;
}

type DataTableRowProps = PrimitivePropsWithRef<'tr'> & DataTableRowOwnProps;

/** `data-state="selected"` (read from `DataTable`'s selection, via `id`) tints the row so a selected row is visible even without looking at its checkbox. */
const DataTableRow = React.forwardRef<HTMLTableRowElement, DataTableRowProps>(
  (props, forwardedRef) => {
    const { className, id, ...rest } = props;
    const context = useDataTableContext('DataTableRow');
    const selected = id !== undefined && context.isSelected(id);

    return (
      <Primitive
        as="tr"
        data-state={selected ? 'selected' : undefined}
        className={cn(
          'hover:bg-[var(--data-table-row-hover-bg)] data-[state=selected]:bg-[var(--data-table-row-selected-bg)]',
          className,
        )}
        {...rest}
        ref={forwardedRef}
      />
    );
  },
);

DataTableRow.displayName = 'DataTableRow';

export { DataTableRow };
export type { DataTableRowProps };
