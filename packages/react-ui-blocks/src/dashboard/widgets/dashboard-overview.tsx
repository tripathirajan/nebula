import { cn } from '@nebula/primitives/cn';
import { Card, CardContent } from '@nebula/react-ui/card';
import { Heading } from '@nebula/react-ui/heading';
import { Sparkline } from '@nebula/react-ui/sparkline';
import { Stat, StatDescription, StatLabel, StatValue } from '@nebula/react-ui/stat';
import * as React from 'react';

interface DashboardMetricTrend {
  /** e.g. "+2.6%" — direction is read from `direction`, not parsed out of this string, so it can be any format ("+2.6%", "2.6% up", ...). */
  value: React.ReactNode;
  direction: 'up' | 'down';
  /** Trailing context after the value, e.g. "last week". */
  description?: React.ReactNode;
}

interface DashboardMetric {
  label: React.ReactNode;
  value: React.ReactNode;
  /** Freeform trailing line, own color via `descriptionClassName` — for a trend with a real up/down direction, use `trend` instead (it renders a matching arrow + semantic color for free). Ignored when `trend` is set; they render in the same slot. */
  description?: React.ReactNode;
  descriptionClassName?: string;
  /** Decorative icon/illustration shown in a tinted circle above the label — `aria-hidden`, the metric's own text already carries the meaning (matches Minimals' "App"/"Booking" dashboard-home stat cards). */
  icon?: React.ReactNode;
  /** A structured up/down trend — renders a colored arrow + `value` (+ optional trailing `description`) in place of the plain `description` slot. */
  trend?: DashboardMetricTrend;
  /** Inline mini chart plotted beside the trend/description line (Minimals' Ecommerce stat cards) — color follows `trend.direction` (success/error) when `trend` is set, else a neutral tone. */
  sparkline?: number[];
}

interface DashboardOverviewProps {
  /** No sensible default — every dashboard has its own metrics. */
  metrics: DashboardMetric[];
  title?: React.ReactNode;
  className?: string;
}

function TrendArrow({ direction }: { direction: 'up' | 'down' }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('h-3.5 w-3.5 shrink-0', direction === 'down' && 'rotate-180')}
    >
      <path d="M7 17 17 7M17 7H9M17 7v8" />
    </svg>
  );
}

/**
 * A responsive grid of metric cards — the metrics-grid half of a dashboard
 * "overview" screen. No full charting of its own (pair with `ChartCard`,
 * `../charts/chart-card`, for that; see
 * `compositions/saas-dashboard-home.stories.tsx` for an example combining
 * both on one page alongside `WelcomeBanner`) — `sparkline` here is only the
 * small inline trend glyph `@nebula/react-ui/sparkline` provides, not a full
 * chart with axes/tooltips.
 *
 * Every card in the grid shares one shape; `icon`/`trend`/`sparkline` are
 * all optional per-metric so the same component covers every stat-card
 * variant this session's `minimals.cc` audit found (plain number+description,
 * icon-led, and trend+sparkline) without a parallel "StatCardsRow" block
 * duplicating this one — pass only the fields a given dashboard needs.
 *
 * @example
 * ```tsx
 * <DashboardOverview
 *   title="Overview"
 *   metrics={[
 *     { label: 'Revenue', value: '$12,450', description: '+12% from last month' },
 *     {
 *       label: 'Product sold',
 *       value: '765',
 *       trend: { value: '+2.6%', direction: 'up', description: 'last week' },
 *       sparkline: [4, 8, 6, 9, 7, 12, 10],
 *     },
 *   ]}
 * />
 * ```
 */
function DashboardOverview(props: DashboardOverviewProps) {
  const { metrics, title, className } = props;

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {title ? (
        <Heading as="h2" level={3}>
          {title}
        </Heading>
      ) : null}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => {
          // `-Text` (not the raw `--color-success`/`--color-error` fill)
          // — those fail WCAG 1.4.3 as inline text in light mode
          // (`CONTRAST_AUDIT.md`); `-Text` is the dark, low-chroma variant
          // meant specifically for this "colored status text on `base.100`"
          // use, same pattern `primaryContent`/`secondaryContent` use for
          // text-on-fill.
          const trendColorClassName =
            metric.trend?.direction === 'down'
              ? 'text-[var(--color-error-text)]'
              : 'text-[var(--color-success-text)]';

          return (
            // Index as key: metrics have no stable identity of their own, and `label` isn't guaranteed unique.
            <Card key={index} variant="outlined">
              <CardContent className="flex flex-col gap-3">
                {metric.icon ? (
                  <span
                    aria-hidden="true"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                  >
                    {metric.icon}
                  </span>
                ) : null}
                <Stat>
                  <StatLabel>{metric.label}</StatLabel>
                  <StatValue>{metric.value}</StatValue>
                  {!metric.trend && metric.description ? (
                    <StatDescription className={metric.descriptionClassName}>
                      {metric.description}
                    </StatDescription>
                  ) : null}
                </Stat>
                {metric.trend || metric.sparkline ? (
                  <div className="flex items-center justify-between gap-2">
                    {metric.trend ? (
                      <StatDescription className={cn('flex items-center gap-1', trendColorClassName)}>
                        <TrendArrow direction={metric.trend.direction} />
                        <span className={trendColorClassName}>{metric.trend.value}</span>
                        {metric.trend.description ? (
                          <span className="text-[var(--stat-label-text)]">{metric.trend.description}</span>
                        ) : null}
                      </StatDescription>
                    ) : null}
                    {metric.sparkline ? (
                      <Sparkline
                        data={metric.sparkline}
                        className={cn('h-8 w-16 shrink-0', trendColorClassName)}
                      />
                    ) : null}
                  </div>
                ) : null}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export { DashboardOverview };
export type { DashboardOverviewProps, DashboardMetric, DashboardMetricTrend };
