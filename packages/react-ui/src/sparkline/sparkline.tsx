import { cn } from '@nebula/primitives/cn';
import { Primitive } from '@nebula/primitives/primitive';
import * as React from 'react';

import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';

interface SparklineOwnProps {
  /** The series to plot — order matters, values don't need to be sorted or non-negative. */
  data: number[];
  /** `line` draws just the stroke; `area` adds a fill fading to transparent down to the baseline, for the "dark stat card" look. @default 'line' */
  variant?: 'line' | 'area';
  /** @default 2 */
  strokeWidth?: number;
}

type SparklineProps = PrimitivePropsWithRef<'svg'> & SparklineOwnProps;

const VIEW_WIDTH = 100;
const VIEW_HEIGHT = 32;
/** Keeps the plotted line off the viewBox's top/bottom edge so a stroke at the min/max value doesn't get visually clipped. */
const PADDING = 3;

/** Maps `data` to an SVG polyline's `points` string within the fixed viewBox, flipping Y since SVG grows downward but a higher value should plot higher (lower Y). Flat data (every value equal, or a single point) plots a level line at vertical center rather than dividing by zero. */
function toPoints(data: number[]): { x: number; y: number }[] {
  if (data.length === 0) return [];
  if (data.length === 1) return [{ x: 0, y: VIEW_HEIGHT / 2 }];

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min;
  const plottableHeight = VIEW_HEIGHT - PADDING * 2;

  return data.map((value, index) => {
    const x = (index / (data.length - 1)) * VIEW_WIDTH;
    const normalized = range === 0 ? 0.5 : (value - min) / range;
    const y = PADDING + (1 - normalized) * plottableHeight;
    return { x, y };
  });
}

/**
 * A dependency-free inline mini line/area chart — no matching
 * `@nebula/headless` compound, same "purely presentational, no ARIA
 * behavior of its own" treatment `Stat`/`Timeline`/`EmptyState` already
 * document. Deliberately plain SVG rather than reaching for `recharts`:
 * `react-ui` has no charting dependency and shouldn't gain one just for a
 * decorative trend glyph — `recharts` stays scoped to
 * `@nebula/react-ui-blocks`'s `ChartCard`, which needs real axes/tooltips/
 * legends a sparkline never does. `aria-hidden` by default (the same
 * convention this repo's decorative-icon SVGs already use, e.g. `Button`'s
 * own inline icons) — a sparkline restates a trend a `Stat`/trend badge
 * already states in text, so it has nothing of its own for a screen reader
 * to announce; pass `role="img"` + `aria-label` explicitly on the rare
 * chart-only use where no adjacent text carries the same information.
 *
 * Stretches to fill whatever `width`/`height` its container gives it
 * (`preserveAspectRatio="none"`, the fixed internal viewBox scales to that
 * box) — sized by CSS, not by the `data` array's own shape. Color reads
 * `currentColor` by default, so it inherits whatever text color its
 * container sets (matching `Stat`'s own "consumer sets color via
 * `className`" convention) rather than hardcoding one.
 *
 * @example
 * ```tsx
 * <Sparkline data={[4, 8, 6, 9, 7, 12, 10]} className="h-8 w-20 text-[var(--color-success)]" />
 * <Sparkline data={[4, 8, 6, 9, 7, 12, 10]} variant="area" className="h-10 w-24 text-white" />
 * ```
 */
const Sparkline = React.forwardRef<SVGSVGElement, SparklineProps>((props, forwardedRef) => {
  const {
    className,
    data,
    variant = 'line',
    strokeWidth = 2,
    'aria-hidden': ariaHidden = true,
    ...rest
  } = props;
  const gradientId = React.useId();

  const points = toPoints(data);
  const linePoints = points.map((point) => `${point.x},${point.y}`).join(' ');
  const areaPoints =
    points.length > 0
      ? `0,${VIEW_HEIGHT} ${linePoints} ${VIEW_WIDTH},${VIEW_HEIGHT}`
      : '';

  return (
    <Primitive
      as="svg"
      viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
      preserveAspectRatio="none"
      fill="none"
      aria-hidden={ariaHidden}
      className={cn('text-[currentColor]', className)}
      {...rest}
      ref={forwardedRef}
    >
      {variant === 'area' && points.length > 0 ? (
        <>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="currentColor" stopOpacity={0.35} />
              <stop offset="100%" stopColor="currentColor" stopOpacity={0} />
            </linearGradient>
          </defs>
          <polygon points={areaPoints} fill={`url(#${gradientId})`} stroke="none" />
        </>
      ) : null}
      {points.length > 0 ? (
        <polyline
          points={linePoints}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : null}
    </Primitive>
  );
});

Sparkline.displayName = 'Sparkline';

export { Sparkline };
export type { SparklineProps };
