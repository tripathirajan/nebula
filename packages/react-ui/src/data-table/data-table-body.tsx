import { cn } from '@nebula-lab/primitives/cn';
import { Primitive } from '@nebula-lab/primitives/primitive';
import * as React from 'react';

import type { PrimitivePropsWithRef } from '@nebula-lab/primitives/primitive';

type DataTableBodyProps = PrimitivePropsWithRef<'tbody'>;

const DataTableBody = React.forwardRef<HTMLTableSectionElement, DataTableBodyProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <Primitive
        as="tbody"
        className={cn('divide-y divide-[var(--data-table-border)]', className)}
        {...rest}
        ref={forwardedRef}
      />
    );
  },
);

DataTableBody.displayName = 'DataTableBody';

export { DataTableBody };
export type { DataTableBodyProps };
