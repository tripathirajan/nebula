import { NumberInputDecrement as HeadlessNumberInputDecrement } from '@nebula/headless/number-input';
import { cn } from '@nebula/primitives/cn';
import * as React from 'react';

import type { NumberInputDecrementProps as HeadlessNumberInputDecrementProps } from '@nebula/headless/number-input';

type NumberInputDecrementProps = HeadlessNumberInputDecrementProps;

/** Defaults to a "-" icon when no `children` is given — see `NumberInputIncrement`. */
const NumberInputDecrement = React.forwardRef<HTMLButtonElement, NumberInputDecrementProps>(
  (props, forwardedRef) => {
    const { className, children, ...rest } = props;
    return (
      <HeadlessNumberInputDecrement
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
            <path d="M5 12h14" />
          </svg>
        )}
      </HeadlessNumberInputDecrement>
    );
  },
);

NumberInputDecrement.displayName = 'NumberInputDecrement';

export { NumberInputDecrement };
export type { NumberInputDecrementProps };
