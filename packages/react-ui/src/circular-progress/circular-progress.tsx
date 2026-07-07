import { Progress as HeadlessProgress } from '@nebula/headless/progress';
import { cn } from '@nebula/primitives/cn';
import * as React from 'react';

import type { ProgressProps as HeadlessProgressProps } from '@nebula/headless/progress';

interface CircularProgressOwnProps {
  /** Diameter in pixels. @default 40 */
  size?: number;
  /** Stroke width in pixels. @default 4 */
  strokeWidth?: number;
}

type CircularProgressProps = HeadlessProgressProps & CircularProgressOwnProps;

/**
 * An SVG-ring variant of `Progress` — same `@nebula/headless` `Progress`
 * underneath (unchanged `role="progressbar"` + `aria-valuenow`/`valuemin`/
 * `valuemax` semantics), just a different visual: a ring built from two
 * stacked `<circle>`s (a dim full track, a bright arc sized via
 * `stroke-dasharray`/`stroke-dashoffset`) instead of `Progress`'s linear
 * bar. Not built as its own `@nebula/headless` or `@nebula/styleless`
 * component — same "skip straight to react-ui" call `SegmentedControl`
 * already makes for `ToggleGroup`, since there's no new behavior here, only
 * a different geometry applied to `Progress`'s existing value/percent math.
 *
 * The indeterminate state (`value={null}`) spins the whole ring via
 * Tailwind's built-in `animate-spin` with a fixed 25%-of-circumference arc,
 * mirroring `Spinner`'s own indeterminate treatment rather than introducing
 * a second animation vocabulary.
 *
 * @example
 * ```tsx
 * <CircularProgress value={60} />
 * <CircularProgress value={null} /> // indeterminate
 * <CircularProgress value={3} max={5} size={56} strokeWidth={6} />
 * ```
 */
const CircularProgress = React.forwardRef<HTMLDivElement, CircularProgressProps>(
  (props, forwardedRef) => {
    const {
      className,
      value = null,
      max = 100,
      size = 40,
      strokeWidth = 4,
      ...rest
    } = props;
    const percent = value == null ? null : Math.min(100, Math.max(0, (value / max) * 100));

    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const indeterminateArc = circumference * 0.75;
    const dashoffset =
      percent == null ? indeterminateArc : circumference - (percent / 100) * circumference;

    return (
      <HeadlessProgress
        value={value}
        max={max}
        className={cn('inline-flex', percent == null && 'animate-spin', className)}
        {...rest}
        ref={forwardedRef}
      >
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            className="stroke-[var(--progress-track-bg)]"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashoffset}
            className={cn(
              'stroke-[var(--progress-indicator-bg)]',
              percent != null && 'transition-[stroke-dashoffset] duration-300 ease-out',
            )}
          />
        </svg>
      </HeadlessProgress>
    );
  },
);

CircularProgress.displayName = 'CircularProgress';

export { CircularProgress };
export type { CircularProgressProps };
