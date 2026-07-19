import { cn } from '@nebula-lab/primitives/cn';
import * as React from 'react';

import { PopoverTrigger } from '../popover/popover-trigger';

import { useMultiSelectContext } from './multi-select-context';

interface MultiSelectTriggerProps extends React.ComponentPropsWithoutRef<'button'> {
  /** Rendered when nothing is selected yet. */
  placeholder?: React.ReactNode;
  /** Caps how many selected labels are spelled out before collapsing to "N selected". @default 2 */
  maxLabels?: number;
}

/**
 * Styled like `SelectTrigger`/`Input` (same border/bg/text triple + rotating
 * chevron), but its visible content is computed from `MultiSelect`'s own
 * label registry rather than a single `SelectValue` child — up to
 * `maxLabels` selected labels are spelled out comma-joined, beyond that it
 * collapses to a `"N selected"` summary, since a multi-select trigger has no
 * fixed-width single value to display the way `Select`'s does.
 */
const MultiSelectTrigger = React.forwardRef<HTMLButtonElement, MultiSelectTriggerProps>(
  (props, forwardedRef) => {
    const { className, placeholder, maxLabels = 2, ...rest } = props;
    const context = useMultiSelectContext('MultiSelectTrigger');

    const labels = context.value.map((v) => context.getItemLabel(v) ?? v);
    const summary =
      labels.length === 0
        ? placeholder
        : labels.length <= maxLabels
          ? labels.join(', ')
          : `${labels.length} selected`;

    return (
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={context.disabled}
          className={cn(
            'group flex w-full items-center justify-between gap-2 rounded-[var(--radius-field)] border border-[var(--multi-select-trigger-border)] bg-[var(--multi-select-trigger-bg)] px-3 py-2 text-sm text-[var(--multi-select-trigger-text)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--multi-select-trigger-text)] disabled:cursor-not-allowed disabled:opacity-50',
            className,
          )}
          {...rest}
          ref={forwardedRef}
        >
          <span className="truncate">{summary}</span>
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
        </button>
      </PopoverTrigger>
    );
  },
);

MultiSelectTrigger.displayName = 'MultiSelectTrigger';

export { MultiSelectTrigger };
export type { MultiSelectTriggerProps };
