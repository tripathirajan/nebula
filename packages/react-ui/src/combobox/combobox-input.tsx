import { cn } from '@nebula/primitives/cn';
import { ComboboxInput as StylelessComboboxInput } from '@nebula/styleless/combobox';
import * as React from 'react';

import type { ComboboxInputProps as StylelessComboboxInputProps } from '@nebula/styleless/combobox';

type ComboboxInputProps = StylelessComboboxInputProps;

/** Styled identically to `Input` — a combobox's text field visually is one. */
const ComboboxInput = React.forwardRef<HTMLInputElement, ComboboxInputProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <StylelessComboboxInput
        className={cn(
          'flex h-10 w-full min-w-0 rounded-[var(--radius-field)] border border-[var(--combobox-input-border)] bg-[var(--combobox-input-bg)] px-3 py-2 text-sm text-[var(--combobox-input-text)] outline-none placeholder:text-[var(--combobox-input-text)]/50 focus-visible:ring-2 focus-visible:ring-[var(--combobox-input-text)] disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...rest}
        ref={forwardedRef}
      />
    );
  },
);

ComboboxInput.displayName = 'ComboboxInput';

export { ComboboxInput };
export type { ComboboxInputProps };
