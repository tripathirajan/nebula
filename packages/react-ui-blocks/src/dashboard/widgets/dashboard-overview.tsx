import { cn } from '@nebula/primitives/cn';
import { Card, CardContent } from '@nebula/react-ui/card';
import { Heading } from '@nebula/react-ui/heading';
import { Stat, StatDescription, StatLabel, StatValue } from '@nebula/react-ui/stat';
import * as React from 'react';

interface DashboardMetric {
  label: React.ReactNode;
  value: React.ReactNode;
  /** e.g. "+12% from last month" — color is left to `descriptionClassName`, since this block has no opinion on what's "good"/"bad" for a given metric. */
  description?: React.ReactNode;
  descriptionClassName?: string;
}

interface DashboardOverviewProps {
  /** No sensible default — every dashboard has its own metrics. */
  metrics: DashboardMetric[];
  title?: React.ReactNode;
  className?: string;
}

/**
 * A responsive grid of metric cards — the metrics-grid half of a dashboard
 * "overview" screen. No charting of its own — pair with `ChartCard`
 * (`../charts/chart-card`) for that; see `compositions/saas-dashboard-home.stories.tsx`
 * for an example combining both on one page alongside `WelcomeBanner`.
 *
 * @example
 * ```tsx
 * <DashboardOverview
 *   title="Overview"
 *   metrics={[
 *     { label: 'Revenue', value: '$12,450', description: '+12% from last month' },
 *     { label: 'Active users', value: '1,204', description: '+4% from last month' },
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
        {metrics.map((metric, index) => (
          // Index as key: metrics have no stable identity of their own, and `label` isn't guaranteed unique.
          <Card key={index} variant="outlined">
            <CardContent>
              <Stat>
                <StatLabel>{metric.label}</StatLabel>
                <StatValue>{metric.value}</StatValue>
                {metric.description ? (
                  <StatDescription className={metric.descriptionClassName}>
                    {metric.description}
                  </StatDescription>
                ) : null}
              </Stat>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export { DashboardOverview };
export type { DashboardOverviewProps, DashboardMetric };
