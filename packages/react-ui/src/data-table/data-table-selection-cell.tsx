import { useDataTableContext } from '@nebula-lab/styleless/data-table';

import { Checkbox } from '../checkbox/checkbox';

interface DataTableSelectionCellProps {
  /** The row's selection id — same id passed to the enclosing `DataTableRow`. */
  id: string;
  /** Accessible label for the checkbox — a row's own visible cells rarely double as one, unlike most other checkbox use in this project. @default 'Select row' */
  'aria-label'?: string;
}

/** A `<td>` holding one row's selection `Checkbox`, wired directly to `DataTable`'s selection state. */
function DataTableSelectionCell(props: DataTableSelectionCellProps) {
  const { id, 'aria-label': ariaLabel = 'Select row' } = props;
  const context = useDataTableContext('DataTableSelectionCell');

  return (
    <td className="w-10 p-3">
      <Checkbox
        checked={context.isSelected(id)}
        onCheckedChange={() => context.toggleSelected(id)}
        aria-label={ariaLabel}
      />
    </td>
  );
}

DataTableSelectionCell.displayName = 'DataTableSelectionCell';

export { DataTableSelectionCell };
export type { DataTableSelectionCellProps };
