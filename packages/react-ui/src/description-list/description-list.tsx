import { cn } from '@nebula/primitives/cn';
import { Primitive } from '@nebula/primitives/primitive';
import * as React from 'react';

import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';

type DescriptionListProps = PrimitivePropsWithRef<'dl'>;

/**
 * A `<dl>` of key/value pairs — `DescriptionTerm`/`DescriptionDetails` are
 * purely presentational structure, same "no matching lower-layer compound"
 * treatment `Stat`/`Card` document. Two-column grid by default (`grid
 * grid-cols-[auto_1fr]`) so every term/details pair lines up, unlike the
 * browser's own default `<dl>` stacking.
 *
 * @example
 * ```tsx
 * <DescriptionList>
 *   <DescriptionTerm>Status</DescriptionTerm>
 *   <DescriptionDetails>Active</DescriptionDetails>
 *   <DescriptionTerm>Plan</DescriptionTerm>
 *   <DescriptionDetails>Pro</DescriptionDetails>
 * </DescriptionList>
 * ```
 */
const DescriptionList = React.forwardRef<HTMLDListElement, DescriptionListProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <Primitive
        as="dl"
        className={cn('grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm', className)}
        {...rest}
        ref={forwardedRef}
      />
    );
  },
);
DescriptionList.displayName = 'DescriptionList';

type DescriptionTermProps = PrimitivePropsWithRef<'dt'>;

const DescriptionTerm = React.forwardRef<HTMLElement, DescriptionTermProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <Primitive
        as="dt"
        className={cn('font-medium text-[var(--description-list-term-text)]', className)}
        {...rest}
        ref={forwardedRef}
      />
    );
  },
);
DescriptionTerm.displayName = 'DescriptionTerm';

type DescriptionDetailsProps = PrimitivePropsWithRef<'dd'>;

const DescriptionDetails = React.forwardRef<HTMLElement, DescriptionDetailsProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <Primitive
        as="dd"
        className={cn('text-[var(--description-list-details-text)]', className)}
        {...rest}
        ref={forwardedRef}
      />
    );
  },
);
DescriptionDetails.displayName = 'DescriptionDetails';

export { DescriptionList, DescriptionTerm, DescriptionDetails };
export type { DescriptionListProps, DescriptionTermProps, DescriptionDetailsProps };
