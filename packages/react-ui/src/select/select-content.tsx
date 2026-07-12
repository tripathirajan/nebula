import { SelectContent as HeadlessSelectContent } from '@nebula/headless/select';
import { cn } from '@nebula/primitives/cn';
import * as React from 'react';

import type { SelectContentProps as HeadlessSelectContentProps } from '@nebula/headless/select';

type SelectContentProps = HeadlessSelectContentProps;

/** The popup listbox panel — same `base-100`/`base-300`/`base-content` surface triple as `PopoverContent`/`DialogContent`. */
const SelectContent = React.forwardRef<HTMLDivElement, SelectContentProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <HeadlessSelectContent
        className={cn(
          'z-[var(--z-overlay)] max-h-72 min-w-32 overflow-y-auto rounded-[var(--radius-popover)] border border-[var(--select-content-border)] bg-[var(--select-content-bg)] p-1 text-[var(--select-text)] shadow-[var(--elevation-anchored)] focus-visible:outline-none',
          className,
        )}
        {...rest}
        ref={forwardedRef}
      />
    );
  },
);

SelectContent.displayName = 'SelectContent';

export { SelectContent };
export type { SelectContentProps };
