import { ComboboxInput as HeadlessComboboxInput } from '@nebula/headless/combobox';
import { cn } from '@nebula/primitives/cn';
import * as React from 'react';

import type { ComboboxInputProps as HeadlessComboboxInputProps } from '@nebula/headless/combobox';

type ComboboxInputProps = HeadlessComboboxInputProps;

/** Styled identically to `Input` — a combobox's text field visually is one. */
const ComboboxInput = React.forwardRef<HTMLInputElement, ComboboxInputProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <HeadlessComboboxInput
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
