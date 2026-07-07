import { FieldLabel as HeadlessFieldLabel } from '@nebula/headless/field';
import { cn } from '@nebula/primitives/cn';
import * as React from 'react';

import type { LabelProps } from '@nebula/primitives/label';

type FieldLabelProps = LabelProps;

const FieldLabel = React.forwardRef<HTMLLabelElement, FieldLabelProps>((props, forwardedRef) => {
  const { className, ...rest } = props;
  return (
    <HeadlessFieldLabel
      className={cn('text-sm font-medium text-[var(--field-label-text)]', className)}
      {...rest}
      ref={forwardedRef}
    />
  );
});

FieldLabel.displayName = 'FieldLabel';

export { FieldLabel };
export type { FieldLabelProps };
