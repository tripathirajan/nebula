import { cn } from '@nebula/primitives/cn';
import { Card, CardContent, CardHeader, CardTitle } from '@nebula/react-ui/card';
import { Text } from '@nebula/react-ui/text';
import * as React from 'react';
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import type { TooltipContentProps } from 'recharts';

/** One of Nebula's 8 semantic color roles — resolved to its `--color-*` CSS var at render time (`danger` maps to `--color-error`, matching Badge/Chip/Tag's existing convention). */
type ChartCardColor =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'neutral'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger';

function colorVar(color: ChartCardColor): string {
  return `var(--color-${color === 'danger' ? 'error' : color})`;
}

interface ChartCardSeries {
  /** The field in each `data` item this series plots. */
  key: string;
  label: string;
  color: ChartCardColor;
}

interface ChartCardDataPoint {
  [field: string]: string | number;
}

type ChartCardKindProps =
  | {
      type: 'bar';
      /** The field in each `data` item used as the category axis (x-axis). */
      categoryKey: string;
      series: ChartCardSeries[];
    }
  | {
      type: 'donut';
      /** The field in each `data` item holding the numeric value to plot. */
      valueKey: string;
      /** The field in each `data` item holding the segment's display name. */
      nameKey: string;
      /** One color per data point, in order — cycles if there are more points than colors. @default ['primary', 'secondary', 'accent', 'info', 'success', 'warning'] */
      colors?: ChartCardColor[];
    };

type ChartCardProps = {
  title: React.ReactNode;
  description?: React.ReactNode;
  data: ChartCardDataPoint[];
  className?: string;
  /** Pixel height of the plotting area. @default 280 */
  height?: number;
} & ChartCardKindProps;

const DEFAULT_DONUT_COLORS: ChartCardColor[] = [
  'primary',
  'secondary',
  'accent',
  'info',
  'success',
  'warning',
];

// `recharts` clones `content={<ChartTooltipContent />}` and injects
// `active`/`payload`/`label` at runtime (see `ContentType`'s own doc
// comment in recharts' Tooltip.d.ts) — the JSX element is created with none
// of them, so the props type here has to be `Partial`, not the full
// `TooltipContentProps` recharts actually calls this with once cloned.
function ChartTooltipContent({ active, payload, label }: Partial<TooltipContentProps<number, string>>) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-[var(--radius-popover)] border border-[var(--popover-content-border)] bg-[var(--popover-content-bg)] px-3 py-2 text-xs text-[var(--popover-text)] shadow-md">
      {label ? <p className="mb-1 font-medium">{label}</p> : null}
      {payload.map((entry) => (
        <p key={`${entry.name}`} className="flex items-center gap-1.5">
          <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: entry.color }} />
          <span>
            {entry.name}: {entry.value}
          </span>
        </p>
      ))}
    </div>
  );
}

/**
 * A dashboard chart card — bar or donut, both themed entirely off Nebula's
 * own `--color-*` semantic tokens (never a hardcoded hex), so a chart
 * re-themes for free the same way every other component in this repo does.
 * Built on `recharts` (the one external, non-`@nebula/*` runtime dependency
 * this package has — no charting primitive exists at any lower layer, and
 * building one from scratch is a much larger investment than this single
 * block needs; `recharts` is marked `external` in `tsup.config.ts` like
 * `react`/`react-dom`, resolved from the consumer's own `node_modules`,
 * not bundled into this package's `dist`).
 *
 * `type: 'bar'` plots one or more `series` (each its own color) against a
 * shared category axis. `type: 'donut'` plots a single numeric field with
 * one color per data point (a donut's "series" is really "one color per
 * category", the opposite axis a bar chart's colors work along) — a
 * discriminated union on `type` keeps each shape's actual prop
 * requirements distinct rather than one loosely-typed props object with
 * fields that only apply to one chart kind.
 *
 * @example
 * ```tsx
 * <ChartCard
 *   title="Revenue by region"
 *   type="bar"
 *   data={[{ month: 'Jan', us: 400, eu: 240 }, { month: 'Feb', us: 300, eu: 139 }]}
 *   categoryKey="month"
 *   series={[
 *     { key: 'us', label: 'US', color: 'primary' },
 *     { key: 'eu', label: 'EU', color: 'info' },
 *   ]}
 * />
 *
 * <ChartCard
 *   title="Traffic by source"
 *   type="donut"
 *   data={[{ source: 'Direct', visits: 4000 }, { source: 'Referral', visits: 1500 }]}
 *   valueKey="visits"
 *   nameKey="source"
 * />
 * ```
 */
function ChartCard(props: ChartCardProps) {
  const { title, description, data, className, height = 280 } = props;

  const total =
    props.type === 'donut' ? data.reduce((sum, point) => sum + Number(point[props.valueKey] ?? 0), 0) : null;

  return (
    <Card variant="outlined" className={cn('flex flex-col', className)}>
      <CardHeader bordered={false}>
        <CardTitle className="text-base">{title}</CardTitle>
        {description ? <Text className="text-sm opacity-70">{description}</Text> : null}
      </CardHeader>
      <CardContent
        role="img"
        aria-label={`${typeof title === 'string' ? title : 'Chart'}${description && typeof description === 'string' ? `: ${description}` : ''}`}
        className="pt-0"
      >
        {props.type === 'bar' ? (
          <ResponsiveContainer width="100%" height={height}>
            <RechartsBarChart data={data} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-base-300)" vertical={false} />
              <XAxis
                dataKey={props.categoryKey}
                tick={{ fill: 'var(--color-base-content)', fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: 'var(--color-base-300)' }}
              />
              <YAxis
                tick={{ fill: 'var(--color-base-content)', fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                width={32}
              />
              <Tooltip content={<ChartTooltipContent />} cursor={{ fill: 'var(--color-base-200)' }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              {props.series.map((series) => (
                <Bar
                  key={series.key}
                  dataKey={series.key}
                  name={series.label}
                  fill={colorVar(series.color)}
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </RechartsBarChart>
          </ResponsiveContainer>
        ) : (
          <div className="relative">
            <ResponsiveContainer width="100%" height={height}>
              <RechartsPieChart>
                <Pie
                  data={data}
                  dataKey={props.valueKey}
                  nameKey={props.nameKey}
                  innerRadius="62%"
                  outerRadius="90%"
                  paddingAngle={2}
                  strokeWidth={0}
                >
                  {data.map((point, index) => {
                    const palette = props.colors ?? DEFAULT_DONUT_COLORS;
                    return (
                      <Cell
                        key={String(point[props.nameKey])}
                        fill={colorVar(palette[index % palette.length] ?? 'primary')}
                      />
                    );
                  })}
                </Pie>
                <Tooltip content={<ChartTooltipContent />} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </RechartsPieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center pb-8">
              <Text className="text-2xl font-bold">{total?.toLocaleString()}</Text>
              <Text className="text-xs opacity-70">Total</Text>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export { ChartCard };
export type { ChartCardProps, ChartCardSeries, ChartCardColor, ChartCardDataPoint };
