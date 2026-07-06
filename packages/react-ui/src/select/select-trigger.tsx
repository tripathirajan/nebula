import { cn } from '@nebula/primitives/cn';
import { SelectTrigger as StylelessSelectTrigger } from '@nebula/styleless/select';
import * as React from 'react';

import type { SelectTriggerProps as StylelessSelectTriggerProps } from '@nebula/styleless/select';

type SelectTriggerProps = StylelessSelectTriggerProps;

/** Styled like `Input` (same border/bg/text triple) with a built-in chevron that rotates on `data-state=open` — reads as a form field, since a `Select` trigger fills the same visual role an `<input>`/native `<select>` would. */
const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  (props, forwardedRef) => {
    const { className, children, ...rest } = props;
    return (
      <StylelessSelectTrigger
        className={cn(
          'group flex w-full items-center justify-between gap-2 rounded-[var(--radius-field)] border border-[var(--select-trigger-border)] bg-[var(--select-trigger-bg)] px-3 py-2 text-sm text-[var(--select-trigger-text)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--select-trigger-text)] disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...rest}
        ref={forwardedRef}
      >
        <span className="truncate">{children}</span>
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4 shrink-0 opacity-60 transition-transform group-data-[state=open]:rotate-180"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </StylelessSelectTrigger>
    );
  },
);

SelectTrigger.displayName = 'SelectTrigger';

export { SelectTrigger };
export type { SelectTriggerProps };
