import { ComboboxContent as HeadlessComboboxContent } from '@nebula/headless/combobox';
import { cn } from '@nebula/primitives/cn';
import * as React from 'react';

import type { ComboboxContentProps as HeadlessComboboxContentProps } from '@nebula/headless/combobox';

type ComboboxContentProps = HeadlessComboboxContentProps;

/** Same surface treatment as `SelectContent`/`PopoverContent`. */
const ComboboxContent = React.forwardRef<HTMLDivElement, ComboboxContentProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <HeadlessComboboxContent
        className={cn(
          'z-50 max-h-72 min-w-32 overflow-y-auto rounded-[var(--radius-popover)] border border-[var(--combobox-content-border)] bg-[var(--combobox-content-bg)] p-1 text-[var(--combobox-text)] shadow-md focus-visible:outline-none',
          className,
        )}
        {...rest}
        ref={forwardedRef}
      />
    );
  },
);

ComboboxContent.displayName = 'ComboboxContent';

export { ComboboxContent };
export type { ComboboxContentProps };
