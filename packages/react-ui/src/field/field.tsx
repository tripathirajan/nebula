import { cn } from '@nebula/primitives/cn';
import { Field as StylelessField } from '@nebula/styleless/field';
import * as React from 'react';

import type { FieldProps as StylelessFieldProps } from '@nebula/styleless/field';

type FieldProps = StylelessFieldProps;

/** Vertical stack layout for a label/control/description/error group — all the `id`/`aria-*` wiring between those sub-parts comes unchanged from the styleless source. */
const Field = React.forwardRef<HTMLDivElement, FieldProps>((props, forwardedRef) => {
  const { className, ...rest } = props;
  return (
    <StylelessField className={cn('flex flex-col gap-1.5', className)} {...rest} ref={forwardedRef} />
  );
});

Field.displayName = 'Field';

export { Field };
export type { FieldProps };
