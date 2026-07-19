import { cn } from '@nebula-lab/primitives/cn';
import { DataTableRow as StylelessDataTableRow } from '@nebula-lab/styleless/data-table';
import * as React from 'react';

import type { DataTableRowProps as StylelessDataTableRowProps } from '@nebula-lab/styleless/data-table';

type DataTableRowProps = StylelessDataTableRowProps & { className?: string };

/**
 * Wraps `@nebula-lab/styleless`'s `DataTableRow` (which owns the real
 * behavior: computing `data-state="selected"` from `DataTable`'s selection,
 * via `id`) and adds only the hover/selected-tint classes — a selected row
 * is visible even without looking at its checkbox.
 */
const DataTableRow = React.forwardRef<HTMLTableRowElement, DataTableRowProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <StylelessDataTableRow
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
