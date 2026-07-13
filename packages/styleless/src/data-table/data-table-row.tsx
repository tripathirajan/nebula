import * as React from 'react';

import { useDataTableContext } from './data-table-context';

interface DataTableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  /** This row's selection id — omit for a header row, which is never selectable itself. */
  id?: string;
}

/**
 * `styleless`-tier `DataTableRow` — sets `data-state="selected"` (read from
 * `DataTable`'s selection, via `id`) so a styled version can tint the row
 * without needing to re-derive selection state itself. No Tailwind classes.
 */
const DataTableRow = React.forwardRef<HTMLTableRowElement, DataTableRowProps>(
  (props, forwardedRef) => {
    const { id, ...rest } = props;
    const context = useDataTableContext('DataTableRow');
    const selected = id !== undefined && context.isSelected(id);

    return <tr data-state={selected ? 'selected' : undefined} {...rest} ref={forwardedRef} />;
  },
);

DataTableRow.displayName = 'DataTableRow';

export { DataTableRow };
export type { DataTableRowProps };
