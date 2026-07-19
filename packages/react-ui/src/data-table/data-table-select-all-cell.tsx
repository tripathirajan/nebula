import { useDataTableContext } from '@nebula-lab/styleless/data-table';

import { Checkbox } from '../checkbox/checkbox';

interface DataTableSelectAllCellProps {
  /** Every selectable row's id — known upfront by the consumer (same convention `Carousel`'s `count` and `StepperItem`'s `index` use), since this cell needs the full set to decide "select all" vs. "clear all" and to compute the indeterminate state. */
  ids: string[];
  /** @default 'Select all rows' */
  'aria-label'?: string;
}

/**
 * A `<th>` holding the header row's "select all" `Checkbox` — `indeterminate`
 * when some but not all of `ids` are selected, `checked` when all are,
 * unchecked otherwise. Clicking it selects all of `ids` from any state other
 * than "all selected," and clears the selection entirely from "all selected"
 * — the conventional select-all-checkbox behavior (never leaves you in the
 * indeterminate state on click, since that state's only reachable by
 * touching individual rows).
 */
function DataTableSelectAllCell(props: DataTableSelectAllCellProps) {
  const { ids, 'aria-label': ariaLabel = 'Select all rows' } = props;
  const context = useDataTableContext('DataTableSelectAllCell');

  const selectedCount = ids.filter((id) => context.isSelected(id)).length;
  const allSelected = ids.length > 0 && selectedCount === ids.length;
  const someSelected = selectedCount > 0 && !allSelected;

  return (
    <th scope="col" className="w-10 p-3">
      <Checkbox
        checked={allSelected ? true : someSelected ? 'indeterminate' : false}
        onCheckedChange={() => context.setSelected(allSelected ? [] : ids)}
        aria-label={ariaLabel}
      />
    </th>
  );
}

DataTableSelectAllCell.displayName = 'DataTableSelectAllCell';

export { DataTableSelectAllCell };
export type { DataTableSelectAllCellProps };
