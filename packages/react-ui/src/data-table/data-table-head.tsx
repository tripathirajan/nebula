import { cn } from '@nebula-lab/primitives/cn';
import { DataTableHead as StylelessDataTableHead } from '@nebula-lab/styleless/data-table';
import * as React from 'react';

import type { DataTableHeadProps as StylelessDataTableHeadProps } from '@nebula-lab/styleless/data-table';

type DataTableHeadProps = Omit<StylelessDataTableHeadProps, 'classNames'> & { className?: string };

/**
 * Wraps `@nebula-lab/styleless`'s `DataTableHead` (which owns the real
 * behavior: the sort `<button>`, `aria-sort` computation, and `data-active`/
 * `data-direction` on the `<th>`) and supplies every part's classes via its
 * `classNames` prop — the sort-direction chevron reacts to the `<th>`'s own
 * `data-active`/`data-direction` via `group`/`group-data-*`, the same
 * technique `Checkbox`/`Switch`/`AccordionTrigger` already use for a child
 * to react to an ancestor's state.
 */
const DataTableHead = React.forwardRef<HTMLTableCellElement, DataTableHeadProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <StylelessDataTableHead
        {...rest}
        ref={forwardedRef}
        classNames={{
          th: cn(
            'group p-3 text-xs font-medium uppercase tracking-wide text-[var(--data-table-head-text)]',
            className,
          ),
          button:
            'flex items-center gap-1 outline-none hover:text-[var(--data-table-text)] focus-visible:ring-2 focus-visible:ring-[var(--data-table-text)]',
          icon: 'h-3 w-3 shrink-0 opacity-30 transition-transform group-data-[active]:opacity-100 group-data-[direction=desc]:rotate-180',
        }}
      />
    );
  },
);

DataTableHead.displayName = 'DataTableHead';

export { DataTableHead };
export type { DataTableHeadProps };
