import { cn } from '@nebula/primitives/cn';
import { Primitive } from '@nebula/primitives/primitive';
import * as React from 'react';

import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';

type DataTableHeaderProps = PrimitivePropsWithRef<'thead'>;

const DataTableHeader = React.forwardRef<HTMLTableSectionElement, DataTableHeaderProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <Primitive
        as="thead"
        className={cn('border-b border-[var(--data-table-border)] bg-[var(--data-table-head-bg)]', className)}
        {...rest}
        ref={forwardedRef}
      />
    );
  },
);

DataTableHeader.displayName = 'DataTableHeader';

export { DataTableHeader };
export type { DataTableHeaderProps };
