import { cn } from '@nebula/primitives/cn';
import { Primitive } from '@nebula/primitives/primitive';
import * as React from 'react';

import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';

type DataTableCaptionProps = PrimitivePropsWithRef<'caption'>;

const DataTableCaption = React.forwardRef<HTMLTableCaptionElement, DataTableCaptionProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <Primitive
        as="caption"
        className={cn('mt-2 text-sm text-[var(--data-table-text)]/70', className)}
        {...rest}
        ref={forwardedRef}
      />
    );
  },
);

DataTableCaption.displayName = 'DataTableCaption';

export { DataTableCaption };
export type { DataTableCaptionProps };
