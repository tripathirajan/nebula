import { cn } from '@nebula/primitives/cn';
import { Primitive } from '@nebula/primitives/primitive';
import * as React from 'react';

import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';

type StatProps = PrimitivePropsWithRef<'div'>;

/**
 * A single metric display — `StatLabel`/`StatValue`/`StatDescription` are
 * purely presentational structure, same "no matching `@nebula/styleless`
 * compound" treatment `Card` documents (single-file compound, not a
 * folder-per-sub-part family, since none of these have behavior of their
 * own either).
 *
 * @example
 * ```tsx
 * <Stat>
 *   <StatLabel>Revenue</StatLabel>
 *   <StatValue>$12,450</StatValue>
 *   <StatDescription className="text-[var(--color-success)]">+12% from last month</StatDescription>
 * </Stat>
 * ```
 */
const Stat = React.forwardRef<HTMLDivElement, StatProps>((props, forwardedRef) => {
  const { className, ...rest } = props;
  return (
    <Primitive as="div" className={cn('flex flex-col gap-1', className)} {...rest} ref={forwardedRef} />
  );
});
Stat.displayName = 'Stat';

type StatLabelProps = PrimitivePropsWithRef<'p'>;

const StatLabel = React.forwardRef<HTMLParagraphElement, StatLabelProps>((props, forwardedRef) => {
  const { className, ...rest } = props;
  return (
    <Primitive
      as="p"
      className={cn('text-sm text-[var(--stat-label-text)]', className)}
      {...rest}
      ref={forwardedRef}
    />
  );
});
StatLabel.displayName = 'StatLabel';

type StatValueProps = PrimitivePropsWithRef<'p'>;

const StatValue = React.forwardRef<HTMLParagraphElement, StatValueProps>((props, forwardedRef) => {
  const { className, ...rest } = props;
  return (
    <Primitive
      as="p"
      className={cn('text-2xl font-semibold text-[var(--stat-value-text)]', className)}
      {...rest}
      ref={forwardedRef}
    />
  );
});
StatValue.displayName = 'StatValue';

type StatDescriptionProps = PrimitivePropsWithRef<'p'>;

const StatDescription = React.forwardRef<HTMLParagraphElement, StatDescriptionProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <Primitive
        as="p"
        className={cn('text-sm text-[var(--stat-label-text)]/70', className)}
        {...rest}
        ref={forwardedRef}
      />
    );
  },
);
StatDescription.displayName = 'StatDescription';

export { Stat, StatLabel, StatValue, StatDescription };
export type { StatProps, StatLabelProps, StatValueProps, StatDescriptionProps };
