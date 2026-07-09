import { Progress as HeadlessProgress } from '@nebula/headless/progress';
import { cn } from '@nebula/primitives/cn';
import * as React from 'react';

import type { ProgressProps as HeadlessProgressProps } from '@nebula/headless/progress';

type ProgressColor =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'neutral'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger';

interface CircularProgressOwnProps {
  /** Diameter in pixels. @default 40 */
  size?: number;
  /** Stroke width in pixels. @default 4 */
  strokeWidth?: number;
  /** Track/indicator color pair — same eight-role palette `Progress`/`Badge`/`Chip` use. @default 'primary' */
  color?: ProgressColor;
}

type CircularProgressProps = Omit<HeadlessProgressProps, 'color'> & CircularProgressOwnProps;

const STROKE_TRACK: Record<ProgressColor, string> = {
  primary: 'stroke-[var(--progress-primary-track-bg)]',
  secondary: 'stroke-[var(--progress-secondary-track-bg)]',
  accent: 'stroke-[var(--progress-accent-track-bg)]',
  neutral: 'stroke-[var(--progress-neutral-track-bg)]',
  info: 'stroke-[var(--progress-info-track-bg)]',
  success: 'stroke-[var(--progress-success-track-bg)]',
  warning: 'stroke-[var(--progress-warning-track-bg)]',
  danger: 'stroke-[var(--progress-danger-track-bg)]',
};

const STROKE_INDICATOR: Record<ProgressColor, string> = {
  primary: 'stroke-[var(--progress-primary-indicator-bg)]',
  secondary: 'stroke-[var(--progress-secondary-indicator-bg)]',
  accent: 'stroke-[var(--progress-accent-indicator-bg)]',
  neutral: 'stroke-[var(--progress-neutral-indicator-bg)]',
  info: 'stroke-[var(--progress-info-indicator-bg)]',
  success: 'stroke-[var(--progress-success-indicator-bg)]',
  warning: 'stroke-[var(--progress-warning-indicator-bg)]',
  danger: 'stroke-[var(--progress-danger-indicator-bg)]',
};

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
 * `color` picks the same track/indicator color pair `Progress` uses, from
 * the full eight-role palette.
 *
 * @example
 * ```tsx
 * <CircularProgress value={60} />
 * <CircularProgress value={60} color="secondary" />
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
      color = 'primary',
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
            className={STROKE_TRACK[color]}
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
              STROKE_INDICATOR[color],
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
