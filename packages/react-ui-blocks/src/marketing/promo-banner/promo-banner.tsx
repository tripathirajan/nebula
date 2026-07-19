import { cn } from '@nebula/primitives/cn';
import { Heading } from '@nebula/react-ui/heading';
import { Text } from '@nebula/react-ui/text';
import * as React from 'react';

/** One of Nebula's 8 semantic color roles — same vocabulary `DashboardMetric`'s `color` prop uses. */
type PromoBannerColor =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'neutral'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger';

interface PromoBannerProps {
  /** Small brand mark above the headline — a wordmark `Text`, an `Image`, or any node. */
  logo?: React.ReactNode;
  /** No sensible default copy — this is the one thing every banner needs. */
  headline: React.ReactNode;
  subheadline?: React.ReactNode;
  /** A decorative image/illustration anchored to the trailing edge, over the color curve — `aria-hidden` applied automatically. */
  media?: React.ReactNode;
  /** Small corner label, e.g. `"Ad"` — omit for a purely editorial promo. */
  badge?: React.ReactNode;
  /** Tints the curved background shape. @default 'primary' */
  color?: PromoBannerColor;
  className?: string;
}

function colorVar(color: PromoBannerColor): string {
  return `var(--color-${color === 'danger' ? 'error' : color})`;
}

/**
 * A single promo/ad-style banner card — headline/subheadline over a
 * light surface, a curved color-block shape sweeping in from the trailing
 * edge (an SVG path with `preserveAspectRatio="none"`, so it stretches to
 * fill any card size/aspect ratio rather than needing per-breakpoint
 * tuning), and an optional trailing media slot anchored over the curve.
 * Purely presentational — pair several with `PromoBannerCarousel` for the
 * "one card on screen at a time, swipe/scroll between them" slider, or use
 * standalone for a single static banner.
 *
 * @example
 * ```tsx
 * <PromoBanner
 *   logo={<Text className="font-semibold">Acme</Text>}
 *   headline="Premium plans, up to 50% off"
 *   subheadline="Limited time offer"
 *   media={<img src="/promo.png" alt="" />}
 *   badge="Ad"
 *   color="info"
 *   className="aspect-[1.9/1] w-full"
 * />
 * ```
 */
function PromoBanner(props: PromoBannerProps) {
  const { logo, headline, subheadline, media, badge, color = 'primary', className } = props;
  const fill = colorVar(color);

  return (
    <div
      className={cn(
        'relative isolate flex items-center gap-3 overflow-hidden rounded-3xl bg-[var(--color-base-100)] p-4 sm:gap-4 sm:p-6 md:p-8',
        className,
      )}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full"
      >
        <path d="M0,62 C20,45 40,78 62,58 C78,44 86,52 100,38 L100,100 L0,100 Z" fill={fill} />
      </svg>
      <div className="flex min-w-0 flex-1 flex-col gap-1 sm:gap-2">
        {logo ? <div className="text-xs font-semibold sm:text-sm">{logo}</div> : null}
        <Heading as="h3" level={4} className="text-base leading-tight sm:text-lg md:text-2xl">
          {headline}
        </Heading>
        {subheadline ? (
          <Text className="text-xs opacity-80 sm:text-sm md:text-base">{subheadline}</Text>
        ) : null}
      </div>
      {media ? (
        <div
          aria-hidden="true"
          className="pointer-events-none relative h-full w-16 shrink-0 self-end sm:w-28 md:w-40 lg:w-48 [&>*]:h-full [&>*]:w-full [&>*]:object-contain [&>*]:object-bottom"
        >
          {media}
        </div>
      ) : null}
      {badge ? (
        <span className="absolute bottom-2 right-2 z-10 rounded bg-[var(--color-neutral)]/70 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[var(--color-neutral-content)] sm:bottom-3 sm:right-3">
          {badge}
        </span>
      ) : null}
    </div>
  );
}

export { PromoBanner };
export type { PromoBannerProps, PromoBannerColor };
