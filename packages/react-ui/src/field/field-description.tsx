import { FieldDescription as HeadlessFieldDescription } from '@nebula/headless/field';
import { cn } from '@nebula/primitives/cn';
import * as React from 'react';

import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';

type FieldDescriptionProps = PrimitivePropsWithRef<'p'>;

const FieldDescription = React.forwardRef<HTMLParagraphElement, FieldDescriptionProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <HeadlessFieldDescription
        className={cn('text-xs text-[var(--field-description-text)]', className)}
        {...rest}
        ref={forwardedRef}
      />
    );
  },
);

FieldDescription.displayName = 'FieldDescription';

export { FieldDescription };
export type { FieldDescriptionProps };
