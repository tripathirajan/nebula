import { cn } from '@nebula/primitives/cn';
import { Primitive } from '@nebula/primitives/primitive';
import { cva } from 'class-variance-authority';
import * as React from 'react';

import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';
import type { VariantProps } from 'class-variance-authority';

const chipVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium',
  {
    variants: {
      variant: {
        neutral: 'bg-[var(--chip-neutral-bg)] text-[var(--chip-neutral-text)]',
        primary: 'bg-[var(--chip-primary-bg)] text-[var(--chip-primary-text)]',
      },
    },
    defaultVariants: {
      variant: 'neutral',
    },
  },
);

interface ChipOwnProps extends VariantProps<typeof chipVariants> {
  /** Called when the built-in "×" button is clicked — omit entirely for a non-dismissible chip (reach for `Tag` if it's never meant to be interactive at all). */
  onDismiss?: () => void;
  /** Accessible label for the dismiss button. Required whenever `onDismiss` is given. */
  dismissLabel?: string;
}

type ChipProps = PrimitivePropsWithRef<'span'> & ChipOwnProps;

/**
 * The interactive/removable pill `Badge`'s own doc comment points at
 * building separately rather than growing an `onDismiss` prop onto itself
 * — this is that component. Rendering the dismiss button only when
 * `onDismiss` is passed keeps a non-dismissible `Chip` (e.g. a read-only
 * filter summary) from getting a button with nothing to do.
 *
 * @example
 * ```tsx
 * <Chip onDismiss={() => removeFilter('color')} dismissLabel="Remove color filter">
 *   Color: Blue
 * </Chip>
 * ```
 */
const Chip = React.forwardRef<HTMLSpanElement, ChipProps>((props, forwardedRef) => {
  const { className, variant, onDismiss, dismissLabel, children, ...rest } = props;
  return (
    <Primitive as="span" className={cn(chipVariants({ variant }), className)} {...rest} ref={forwardedRef}>
      {children}
      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          aria-label={dismissLabel}
          className="-mr-1 rounded-full p-0.5 outline-none hover:bg-black/10 focus-visible:ring-2 focus-visible:ring-current"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-3 w-3"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      ) : null}
    </Primitive>
  );
});

Chip.displayName = 'Chip';

export { Chip, chipVariants };
export type { ChipProps };
