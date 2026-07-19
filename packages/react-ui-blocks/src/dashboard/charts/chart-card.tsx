import { cn } from '@nebula-lab/primitives/cn';
import { Card, CardContent, CardHeader, CardTitle } from '@nebula-lab/react-ui/card';
import { Text } from '@nebula-lab/react-ui/text';
import * as React from 'react';
import {
  Area,
  AreaChart as RechartsAreaChart,
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart as RechartsLineChart,
  Pie,
  PieChart as RechartsPieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart as RechartsRadarChart,
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

/** Shared by every chart kind that plots one or more `series` against a category axis (`bar`/`line`/`area`/`radar`). */
interface ChartCardCategorySeriesProps {
  /** The field in each `data` item used as the category axis (`bar`/`line`/`area`'s x-axis, `radar`'s angle axis). */
  categoryKey: string;
  series: ChartCardSeries[];
}

type ChartCardKindProps =
  | ({ type: 'bar' } & ChartCardCategorySeriesProps)
  | {
      type: 'donut';
      /** The field in each `data` item holding the numeric value to plot. */
      valueKey: string;
      /** The field in each `data` item holding the segment's display name. */
      nameKey: string;
      /** One color per data point, in order — cycles if there are more points than colors. @default ['primary', 'secondary', 'accent', 'info', 'success', 'warning'] */
      colors?: ChartCardColor[];
    }
  | ({ type: 'line' } & ChartCardCategorySeriesProps)
  | ({
      type: 'area';
      /** Stack series on top of each other instead of overlaying them. @default false */
      stacked?: boolean;
    } & ChartCardCategorySeriesProps)
  | ({ type: 'radar' } & ChartCardCategorySeriesProps)
  | {
      type: 'gauge';
      /** The field in `data`'s first item holding the current value. */
      valueKey: string;
      /** The value that represents a full gauge. @default 100 */
      max?: number;
      /** @default 'primary' */
      color?: ChartCardColor;
      /** Small label under the value, e.g. "of monthly goal". */
      valueLabel?: string;
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

interface ChartLegendItem {
  label: string;
  color: ChartCardColor;
}

/**
 * A plain, real (non-`recharts`) legend list — rendered as a sibling of the
 * `role="img"` chart region, never inside it. `recharts`' own built-in
 * `<Legend>` renders real, readable DOM (text + small SVG swatch icons per
 * item), and nesting that inside a `role="img"` ancestor is what an
 * automated a11y scan (Storybook's addon-a11y / axe-core) flags as
 * "element's background color could not be determined because element
 * contains an image node" — `role="img"` tells assistive tech the whole
 * subtree is one flattened picture, which the legend's real text content
 * contradicts. Rolling this instead of using `recharts`' `<Legend>` also
 * means the legend's type/spacing/color read off this repo's own tokens
 * (`Text`, `--color-*`) like everything else, rather than `recharts`'
 * default inline styles.
 */
function ChartLegend({ items }: { items: ChartLegendItem[] }) {
  return (
    <ul className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1.5">
      {items.map((item) => (
        <li key={item.label} className="flex items-center gap-1.5">
          <span
            aria-hidden="true"
            className="h-2 w-2 shrink-0 rounded-full"
            style={{ backgroundColor: colorVar(item.color) }}
          />
          <Text className="text-xs opacity-70">{item.label}</Text>
        </li>
      ))}
    </ul>
  );
}

/** `role="img"` on a chart's wrapping `<div>` needs a real accessible name — `recharts` renders no text a screen reader can use on its own. */
function chartAriaLabel(title: React.ReactNode, description?: React.ReactNode): string {
  const titleText = typeof title === 'string' ? title : 'Chart';
  const descriptionText = description && typeof description === 'string' ? `: ${description}` : '';
  return `${titleText}${descriptionText}`;
}

/**
 * A dashboard chart card — bar, line, area, radar, donut, or gauge, all
 * themed entirely off Nebula's own `--color-*` semantic tokens (never a
 * hardcoded hex), so a chart re-themes for free the same way every other
 * component in this repo does. Built on `recharts` (the one external,
 * non-`@nebula-lab/*` runtime dependency this package has — no charting
 * primitive exists at any lower layer, and building one from scratch is a
 * much larger investment than this single block needs; `recharts` is
 * marked `external` in `tsup.config.ts` like `react`/`react-dom`, resolved
 * from the consumer's own `node_modules`, not bundled into this package's
 * `dist`).
 *
 * `bar`/`line`/`area`/`radar` all plot one or more `series` (each its own
 * color) against a shared `categoryKey` axis — `area` additionally accepts
 * `stacked`. `donut` plots a single numeric field with one color per data
 * point (a donut's "series" is really "one color per category", the
 * opposite axis the other four work along). `gauge` is the odd one out —
 * a single scalar against a `max`, rendered as a semi-circle (recharts has
 * no dedicated gauge primitive; this is the standard half-donut technique:
 * a two-segment `Pie` spanning 180°, `value` colored, the remainder in the
 * neutral track color). A discriminated union on `type` keeps each shape's
 * actual prop requirements distinct rather than one loosely-typed props
 * object with fields that only apply to one chart kind.
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
 *
 * <ChartCard
 *   title="Storage used"
 *   type="gauge"
 *   data={[{ used: 72 }]}
 *   valueKey="used"
 *   valueLabel="of 100 GB"
 * />
 * ```
 */
function ChartCard(props: ChartCardProps) {
  const { title, description, data, className, height = 280 } = props;
  // Only consumed by `type: 'area'`, but hooks must run unconditionally —
  // cheap enough to call for every chart kind.
  const gradientBaseId = React.useId();

  const total =
    props.type === 'donut' ? data.reduce((sum, point) => sum + Number(point[props.valueKey] ?? 0), 0) : null;

  const ariaLabel = chartAriaLabel(title, description);

  return (
    <Card variant="outlined" className={cn('flex flex-col', className)}>
      <CardHeader bordered={false}>
        <CardTitle className="text-base">{title}</CardTitle>
        {description ? <Text className="text-sm opacity-70">{description}</Text> : null}
      </CardHeader>
      <CardContent className="pt-0">
        {props.type === 'bar' ? (
          <>
            <div role="img" aria-label={ariaLabel}>
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
            </div>
            <ChartLegend items={props.series.map((series) => ({ label: series.label, color: series.color }))} />
          </>
        ) : props.type === 'line' ? (
          <>
            <div role="img" aria-label={ariaLabel}>
              <ResponsiveContainer width="100%" height={height}>
                <RechartsLineChart data={data}>
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
                  <Tooltip content={<ChartTooltipContent />} cursor={{ stroke: 'var(--color-base-300)' }} />
                  {props.series.map((series) => (
                    <Line
                      key={series.key}
                      type="monotone"
                      dataKey={series.key}
                      name={series.label}
                      stroke={colorVar(series.color)}
                      strokeWidth={2}
                      dot={{ r: 3, fill: colorVar(series.color), strokeWidth: 0 }}
                      activeDot={{ r: 5 }}
                    />
                  ))}
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
            <ChartLegend items={props.series.map((series) => ({ label: series.label, color: series.color }))} />
          </>
        ) : props.type === 'area' ? (
          <>
            <div role="img" aria-label={ariaLabel}>
              <ResponsiveContainer width="100%" height={height}>
                <RechartsAreaChart data={data}>
                  <defs>
                    {props.series.map((series) => (
                      <linearGradient
                        key={series.key}
                        id={`${gradientBaseId}-${series.key}`}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop offset="5%" stopColor={colorVar(series.color)} stopOpacity={0.35} />
                        <stop offset="95%" stopColor={colorVar(series.color)} stopOpacity={0} />
                      </linearGradient>
                    ))}
                  </defs>
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
                  <Tooltip content={<ChartTooltipContent />} cursor={{ stroke: 'var(--color-base-300)' }} />
                  {props.series.map((series) => (
                    <Area
                      key={series.key}
                      type="monotone"
                      dataKey={series.key}
                      name={series.label}
                      stroke={colorVar(series.color)}
                      strokeWidth={2}
                      fill={`url(#${gradientBaseId}-${series.key})`}
                      stackId={props.stacked ? 'stack' : undefined}
                    />
                  ))}
                </RechartsAreaChart>
              </ResponsiveContainer>
            </div>
            <ChartLegend items={props.series.map((series) => ({ label: series.label, color: series.color }))} />
          </>
        ) : props.type === 'radar' ? (
          <>
            <div role="img" aria-label={ariaLabel}>
              <ResponsiveContainer width="100%" height={height}>
                <RechartsRadarChart data={data}>
                  <PolarGrid stroke="var(--color-base-300)" />
                  <PolarAngleAxis
                    dataKey={props.categoryKey}
                    tick={{ fill: 'var(--color-base-content)', fontSize: 12 }}
                  />
                  <PolarRadiusAxis tick={{ fill: 'var(--color-base-content)', fontSize: 10 }} axisLine={false} />
                  <Tooltip content={<ChartTooltipContent />} />
                  {props.series.map((series) => (
                    <Radar
                      key={series.key}
                      dataKey={series.key}
                      name={series.label}
                      stroke={colorVar(series.color)}
                      fill={colorVar(series.color)}
                      fillOpacity={0.25}
                      // Real recharts 3.9 bug, confirmed by reading Radar.js: its
                      // mount-in animation interpolates from a collapsed (radius 0)
                      // start point but never advances past frame 0 on first paint —
                      // the polygon stays collapsed at the center until something
                      // else (e.g. a window resize) forces a second layout pass.
                      // Every other chart type here animates fine; only Radar needs
                      // this off.
                      isAnimationActive={false}
                    />
                  ))}
                </RechartsRadarChart>
              </ResponsiveContainer>
            </div>
            <ChartLegend items={props.series.map((series) => ({ label: series.label, color: series.color }))} />
          </>
        ) : props.type === 'gauge' ? (
          (() => {
            const max = props.max ?? 100;
            const value = Number(data[0]?.[props.valueKey] ?? 0);
            const percentage = Math.min(100, Math.max(0, max === 0 ? 0 : (value / max) * 100));
            const color = props.color ?? 'primary';
            const gaugeHeight = Math.round(height * 0.6);
            return (
              <div className="relative">
                <div
                  role="img"
                  aria-label={`${ariaLabel}: ${value} of ${max}${props.valueLabel ? ` (${props.valueLabel})` : ''}`}
                >
                  <ResponsiveContainer width="100%" height={gaugeHeight}>
                    <RechartsPieChart>
                      <Pie
                        data={[{ name: 'value', amount: percentage }, { name: 'remainder', amount: 100 - percentage }]}
                        dataKey="amount"
                        nameKey="name"
                        startAngle={180}
                        endAngle={0}
                        cy="85%"
                        innerRadius="72%"
                        outerRadius="100%"
                        paddingAngle={0}
                        strokeWidth={0}
                        isAnimationActive={false}
                      >
                        <Cell fill={colorVar(color)} />
                        <Cell fill="var(--color-base-300)" />
                      </Pie>
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-end pb-1">
                  <Text className="text-2xl font-bold">{value.toLocaleString()}</Text>
                  {props.valueLabel ? <Text className="text-xs opacity-70">{props.valueLabel}</Text> : null}
                </div>
              </div>
            );
          })()
        ) : (
          <>
            <div className="relative">
              <div role="img" aria-label={ariaLabel}>
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
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center pb-8">
                <Text className="text-2xl font-bold">{total?.toLocaleString()}</Text>
                <Text className="text-xs opacity-70">Total</Text>
              </div>
            </div>
            <ChartLegend
              items={data.map((point, index) => {
                const palette = props.colors ?? DEFAULT_DONUT_COLORS;
                return {
                  label: String(point[props.nameKey]),
                  color: palette[index % palette.length] ?? 'primary',
                };
              })}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
}

export { ChartCard };
export type { ChartCardProps, ChartCardSeries, ChartCardColor, ChartCardDataPoint };
