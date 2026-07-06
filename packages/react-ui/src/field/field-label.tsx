import { cn } from '@nebula/primitives/cn';
import { FieldLabel as StylelessFieldLabel } from '@nebula/styleless/field';
import * as React from 'react';

import type { LabelProps } from '@nebula/primitives/label';

type FieldLabelProps = LabelProps;

const FieldLabel = React.forwardRef<HTMLLabelElement, FieldLabelProps>((props, forwardedRef) => {
  const { className, ...rest } = props;
  return (
    <StylelessFieldLabel
      className={cn('text-sm font-medium text-[var(--field-label-text)]', className)}
      {...rest}
      ref={forwardedRef}
    />
  );
});

FieldLabel.displayName = 'FieldLabel';

export { FieldLabel };
export type { FieldLabelProps };
