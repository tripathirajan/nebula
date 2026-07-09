import { Spinner as HeadlessSpinner } from '@nebula/headless/spinner';
import { cn } from '@nebula/primitives/cn';
import { cva } from 'class-variance-authority';
import * as React from 'react';

import type { SpinnerProps as HeadlessSpinnerProps } from '@nebula/headless/spinner';
import type { VariantProps } from 'class-variance-authority';

/**
 * A spinner ring has no shape axis (no "ghost"/"outline" analogue), only a
 * hue — so its one axis is named `color`, not `variant`, matching
 * `Button`/`Badge`/`Chip`'s vocabulary where `variant` always means shape.
 */
const spinnerVariants = cva('inline-block h-5 w-5 animate-spin rounded-full border-2', {
  variants: {
    color: {
      primary: 'border-[var(--spinner-primary-track)] border-t-[var(--spinner-primary-indicator)]',
      secondary:
        'border-[var(--spinner-secondary-track)] border-t-[var(--spinner-secondary-indicator)]',
      accent: 'border-[var(--spinner-accent-track)] border-t-[var(--spinner-accent-indicator)]',
      neutral: 'border-[var(--spinner-neutral-track)] border-t-[var(--spinner-neutral-indicator)]',
      info: 'border-[var(--spinner-info-track)] border-t-[var(--spinner-info-indicator)]',
      success: 'border-[var(--spinner-success-track)] border-t-[var(--spinner-success-indicator)]',
      warning: 'border-[var(--spinner-warning-track)] border-t-[var(--spinner-warning-indicator)]',
      danger: 'border-[var(--spinner-danger-track)] border-t-[var(--spinner-danger-indicator)]',
    },
  },
  defaultVariants: { color: 'primary' },
});

type SpinnerProps = HeadlessSpinnerProps & VariantProps<typeof spinnerVariants>;

/**
 * Styled wrapper around `@nebula/headless`'s `Spinner` — the `role="status"`
 * + visually-hidden label announcement come from there unchanged. This
 * layer adds the actual spinning visual: a ring built from two stacked
 * borders (a dim full circle track, a bright quarter-arc indicator on just
 * the top edge), rotated with Tailwind's built-in `animate-spin` — no custom
 * `@keyframes` needed. `color` picks the indicator/track color pair from
 * the full eight-role palette (see `spinnerVariants`), same vocabulary
 * `Badge`/`Chip` use.
 *
 * @example
 * ```tsx
 * <Spinner />
 * <Spinner color="secondary" />
 * <Spinner className="h-8 w-8 border-4" label="Loading results" />
 * ```
 */
const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>((props, forwardedRef) => {
  const { className, color, ...rest } = props;
  return (
    <HeadlessSpinner
      className={cn(spinnerVariants({ color }), className)}
      {...rest}
      ref={forwardedRef}
    />
  );
});

Spinner.displayName = 'Spinner';

export { Spinner, spinnerVariants };
export type { SpinnerProps };
