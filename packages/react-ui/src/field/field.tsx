import { Field as HeadlessField } from '@nebula/headless/field';
import { cn } from '@nebula/primitives/cn';
import * as React from 'react';

import type { FieldProps as HeadlessFieldProps } from '@nebula/headless/field';

type FieldProps = HeadlessFieldProps;

/** Vertical stack layout for a label/control/description/error group — all the `id`/`aria-*` wiring between those sub-parts comes unchanged from the headless source. */
const Field = React.forwardRef<HTMLDivElement, FieldProps>((props, forwardedRef) => {
  const { className, ...rest } = props;
  return (
    <HeadlessField className={cn('flex flex-col gap-1.5', className)} {...rest} ref={forwardedRef} />
  );
});

Field.displayName = 'Field';

export { Field };
export type { FieldProps };
