import { cn } from '@nebula/primitives/cn';
import { NumberInputIncrement as StylelessNumberInputIncrement } from '@nebula/styleless/number-input';
import * as React from 'react';

import type { NumberInputIncrementProps as StylelessNumberInputIncrementProps } from '@nebula/styleless/number-input';

type NumberInputIncrementProps = StylelessNumberInputIncrementProps;

/** Defaults to a "+" icon when no `children` is given — same convention `RatingItem`'s default star and `BreadcrumbSeparator`'s default chevron use. */
const NumberInputIncrement = React.forwardRef<HTMLButtonElement, NumberInputIncrementProps>(
  (props, forwardedRef) => {
    const { className, children, ...rest } = props;
    return (
      <StylelessNumberInputIncrement
        className={cn(
          'flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-field)] border border-[var(--input-border)] text-[var(--input-text)] outline-none hover:bg-[var(--input-border)]/20 focus-visible:ring-2 focus-visible:ring-[var(--input-ring)] disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...rest}
        ref={forwardedRef}
      >
        {children ?? (
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
        )}
      </StylelessNumberInputIncrement>
    );
  },
);

NumberInputIncrement.displayName = 'NumberInputIncrement';

export { NumberInputIncrement };
export type { NumberInputIncrementProps };
