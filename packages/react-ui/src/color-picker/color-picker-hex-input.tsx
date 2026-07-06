import { cn } from '@nebula/primitives/cn';
import { ColorPickerHexInput as StylelessColorPickerHexInput } from '@nebula/styleless/color-picker';
import * as React from 'react';

import type { ColorPickerHexInputProps as StylelessColorPickerHexInputProps } from '@nebula/styleless/color-picker';

type ColorPickerHexInputProps = StylelessColorPickerHexInputProps;

/** Built on `@nebula/primitives`' bare `Input` (see the styleless source), not this package's own styled `Input` — so this needs the same `--input-*` treatment applied directly, rather than getting it for free by wrapping `react-ui`'s `Input`. */
const ColorPickerHexInput = React.forwardRef<HTMLInputElement, ColorPickerHexInputProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <StylelessColorPickerHexInput
        className={cn(
          'flex h-10 w-full min-w-0 rounded-[var(--radius-field)] border border-[var(--input-border)] bg-[var(--input-bg)] px-3 py-2 text-sm text-[var(--input-text)] transition-colors placeholder:text-[var(--input-text)]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--input-ring)] focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-[var(--input-invalid-border)] aria-[invalid=true]:focus-visible:ring-[var(--input-invalid-ring)]',
          className,
        )}
        {...rest}
        ref={forwardedRef}
      />
    );
  },
);

ColorPickerHexInput.displayName = 'ColorPickerHexInput';

export { ColorPickerHexInput };
export type { ColorPickerHexInputProps };
