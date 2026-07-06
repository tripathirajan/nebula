import { cn } from '@nebula/primitives/cn';
import { NumberInputField as StylelessNumberInputField } from '@nebula/styleless/number-input';
import * as React from 'react';

import type { NumberInputFieldProps as StylelessNumberInputFieldProps } from '@nebula/styleless/number-input';

type NumberInputFieldProps = StylelessNumberInputFieldProps;

/** Same `--input-*` treatment `react-ui`'s own `Input` uses — built on `@nebula/primitives`' bare `Input` (see the styleless source), not this package's styled one, so needs it applied directly, same reasoning `ColorPickerHexInput` documents. */
const NumberInputField = React.forwardRef<HTMLInputElement, NumberInputFieldProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <StylelessNumberInputField
        className={cn(
          'flex h-10 w-full min-w-0 rounded-[var(--radius-field)] border border-[var(--input-border)] bg-[var(--input-bg)] px-3 py-2 text-center text-sm text-[var(--input-text)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--input-ring)] focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...rest}
        ref={forwardedRef}
      />
    );
  },
);

NumberInputField.displayName = 'NumberInputField';

export { NumberInputField };
export type { NumberInputFieldProps };
