import { Spinner as HeadlessSpinner } from '@nebula/headless/spinner';
import { cn } from '@nebula/primitives/cn';
import { cva } from 'class-variance-authority';
import * as React from 'react';

import type { SpinnerProps as HeadlessSpinnerProps } from '@nebula/headless/spinner';
import type { VariantProps } from 'class-variance-authority';

const spinnerVariants = cva('inline-block h-5 w-5 animate-spin rounded-full border-2', {
  variants: {
    variant: {
      primary: 'border-[var(--spinner-primary-track)] border-t-[var(--spinner-primary-indicator)]',
      secondary:
        'border-[var(--spinner-secondary-track)] border-t-[var(--spinner-secondary-indicator)]',
    },
  },
  defaultVariants: { variant: 'primary' },
});

type SpinnerProps = HeadlessSpinnerProps & VariantProps<typeof spinnerVariants>;

/**
 * Styled wrapper around `@nebula/headless`'s `Spinner` — the `role="status"`
 * + visually-hidden label announcement come from there unchanged. This
 * layer adds the actual spinning visual: a ring built from two stacked
 * borders (a dim full circle track, a bright quarter-arc indicator on just
 * the top edge), rotated with Tailwind's built-in `animate-spin` — no custom
 * `@keyframes` needed. `variant` picks the indicator/track color pair (see
 * `spinnerVariants`), same `primary`/`secondary` axis `Button` uses.
 *
 * @example
 * ```tsx
 * <Spinner />
 * <Spinner variant="secondary" />
 * <Spinner className="h-8 w-8 border-4" label="Loading results" />
 * ```
 */
const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>((props, forwardedRef) => {
  const { className, variant, ...rest } = props;
  return (
    <HeadlessSpinner
      className={cn(spinnerVariants({ variant }), className)}
      {...rest}
      ref={forwardedRef}
    />
  );
});

Spinner.displayName = 'Spinner';

export { Spinner, spinnerVariants };
export type { SpinnerProps };
