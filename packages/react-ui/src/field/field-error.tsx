import { cn } from '@nebula/primitives/cn';
import { FieldError as StylelessFieldError } from '@nebula/styleless/field';
import * as React from 'react';

import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';

type FieldErrorProps = PrimitivePropsWithRef<'p'>;

const FieldError = React.forwardRef<HTMLParagraphElement, FieldErrorProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <StylelessFieldError
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
