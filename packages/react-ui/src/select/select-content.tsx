import { cn } from '@nebula/primitives/cn';
import { SelectContent as StylelessSelectContent } from '@nebula/styleless/select';
import * as React from 'react';

import type { SelectContentProps as StylelessSelectContentProps } from '@nebula/styleless/select';

type SelectContentProps = StylelessSelectContentProps;

/** The popup listbox panel — same `base-100`/`base-300`/`base-content` surface triple as `PopoverContent`/`DialogContent`. */
const SelectContent = React.forwardRef<HTMLDivElement, SelectContentProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <StylelessSelectContent
        className={cn(
          'z-50 max-h-72 min-w-32 overflow-y-auto rounded-[var(--radius-popover)] border border-[var(--select-content-border)] bg-[var(--select-content-bg)] p-1 text-[var(--select-text)] shadow-md focus-visible:outline-none',
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
