import { cn } from '@nebula/primitives/cn';
import { Primitive } from '@nebula/primitives/primitive';
import * as React from 'react';

import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';

type DataTableCellProps = PrimitivePropsWithRef<'td'>;

const DataTableCell = React.forwardRef<HTMLTableCellElement, DataTableCellProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <Primitive
        as="td"
        className={cn('p-3 text-[var(--data-table-text)]', className)}
        {...rest}
        ref={forwardedRef}
      />
    );
  },
);

DataTableCell.displayName = 'DataTableCell';

export { DataTableCell };
export type { DataTableCellProps };
