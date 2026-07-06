import { cn } from '@nebula/primitives/cn';
import {
  Progress as StylelessProgress,
  ProgressIndicator as StylelessProgressIndicator,
} from '@nebula/styleless/progress';
import * as React from 'react';

import type { ProgressProps as StylelessProgressProps } from '@nebula/styleless/progress';

type ProgressProps = StylelessProgressProps;

/**
 * Styled wrapper around `@nebula/styleless`'s `Progress`/`ProgressIndicator`
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
 * @example
 * ```tsx
 * <Progress value={60} />
 * <Progress value={null} /> // indeterminate
 * <Progress value={3} max={5} getValueLabel={(v, m) => `${v} of ${m} steps`} />
 * ```
 */
const Progress = React.forwardRef<HTMLDivElement, ProgressProps>((props, forwardedRef) => {
  const { className, value = null, max = 100, ...rest } = props;
  const percent = value == null ? null : Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <StylelessProgress
      value={value}
      max={max}
      className={cn(
        'h-2 w-full overflow-hidden rounded-[var(--radius-progress)] bg-[var(--progress-track-bg)]',
        className,
      )}
      {...rest}
      ref={forwardedRef}
    >
      <StylelessProgressIndicator
        className={cn(
          'h-full rounded-[var(--radius-progress)] bg-[var(--progress-indicator-bg)]',
          percent == null ? 'w-full animate-pulse' : 'transition-transform duration-300 ease-out',
        )}
        style={percent == null ? { width: '100%' } : { width: '100%', transform: `translateX(-${100 - percent}%)` }}
      />
    </StylelessProgress>
  );
});

Progress.displayName = 'Progress';

export { Progress };
export type { ProgressProps };
