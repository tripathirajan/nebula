import { FieldError as HeadlessFieldError } from '@nebula/headless/field';
import { cn } from '@nebula/primitives/cn';
import * as React from 'react';

import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';

type FieldErrorProps = PrimitivePropsWithRef<'p'>;

const FieldError = React.forwardRef<HTMLParagraphElement, FieldErrorProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <HeadlessFieldError
        className={cn('text-xs text-[var(--field-error-text)]', className)}
        {...rest}
        ref={forwardedRef}
      />
    );
  },
);

FieldError.displayName = 'FieldError';

export { FieldError };
export type { FieldErrorProps };
