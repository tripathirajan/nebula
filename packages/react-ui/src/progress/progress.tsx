import {
  Progress as HeadlessProgress,
  ProgressIndicator as HeadlessProgressIndicator,
} from '@nebula/headless/progress';
import { cn } from '@nebula/primitives/cn';
import { cva } from 'class-variance-authority';
import * as React from 'react';

import type { ProgressProps as HeadlessProgressProps } from '@nebula/headless/progress';
import type { VariantProps } from 'class-variance-authority';

const progressTrackVariants = cva('h-2 w-full overflow-hidden rounded-[var(--radius-progress)]', {
  variants: {
    variant: {
      primary: 'bg-[var(--progress-primary-track-bg)]',
      secondary: 'bg-[var(--progress-secondary-track-bg)]',
    },
  },
  defaultVariants: { variant: 'primary' },
});

const progressIndicatorVariants = cva('h-full rounded-[var(--radius-progress)]', {
  variants: {
    variant: {
      primary: 'bg-[var(--progress-primary-indicator-bg)]',
      secondary: 'bg-[var(--progress-secondary-indicator-bg)]',
    },
  },
  defaultVariants: { variant: 'primary' },
});

type ProgressProps = HeadlessProgressProps & VariantProps<typeof progressTrackVariants>;

/**
 * Styled wrapper around `@nebula/headless`'s `Progress`/`ProgressIndicator`
 * pair — the `role="progressbar"` semantics, `aria-valuenow`/`valuemin`/
 * `valuemax`/`valuetext`, and indeterminate handling all come from there
 * unchanged. Unlike `Accordion`/`Dialog`/etc., this layer doesn't re-expose
 * `ProgressIndicator` as its own public part: there's only ever one
 * indicator per progress bar in this design (no multi-segment/stacked
 * progress support), so — same reasoning `Checkbox`'s built-in indicator
 * icons use instead of a separate `CheckboxIndicator` — a separate
 * subcomponent here would be unused complexity. Instead, this component
 * computes the fill percentage once, here, from the same `value`/`max` props
 * the consumer already passed in, and applies it as an inline `transform`
 * on the indicator (a `translateX`, so the same rounded track works without
 * a width/overflow recalculation).
 *
 * The indeterminate state uses Tailwind's built-in `animate-pulse` on a
 * full-width fill rather than a sliding-bar animation — a sliding
 * indeterminate bar needs a custom `@keyframes` this project doesn't define
 * anywhere else yet; a pulsing full bar is the simpler, purely-Tailwind-core
 * option and a fine default. Swap it for a custom animation later if a
 * sliding bar is wanted.
 *
 * `variant` picks the track/indicator color pair (see `progressTrackVariants`/
 * `progressIndicatorVariants`), same `primary`/`secondary` axis `Button` uses.
 *
 * @example
 * ```tsx
 * <Progress value={60} />
 * <Progress value={60} variant="secondary" />
 * <Progress value={null} /> // indeterminate
 * <Progress value={3} max={5} getValueLabel={(v, m) => `${v} of ${m} steps`} />
 * ```
 */
const Progress = React.forwardRef<HTMLDivElement, ProgressProps>((props, forwardedRef) => {
  const { className, variant, value = null, max = 100, ...rest } = props;
  const percent = value == null ? null : Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <HeadlessProgress
      value={value}
      max={max}
      className={cn(progressTrackVariants({ variant }), className)}
      {...rest}
      ref={forwardedRef}
    >
      <HeadlessProgressIndicator
        className={cn(
          progressIndicatorVariants({ variant }),
          percent == null ? 'w-full animate-pulse' : 'transition-transform duration-300 ease-out',
        )}
        style={percent == null ? { width: '100%' } : { width: '100%', transform: `translateX(-${100 - percent}%)` }}
      />
    </HeadlessProgress>
  );
});

Progress.displayName = 'Progress';

export { Progress, progressTrackVariants, progressIndicatorVariants };
export type { ProgressProps };
