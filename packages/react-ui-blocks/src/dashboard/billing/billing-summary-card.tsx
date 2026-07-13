import { cn } from '@nebula/primitives/cn';
import { Card, CardContent, CardHeader, CardTitle } from '@nebula/react-ui/card';
import { Progress } from '@nebula/react-ui/progress';
import { Text } from '@nebula/react-ui/text';
import * as React from 'react';

/** One of Nebula's 8 semantic color roles — matches `ChartCard`'s `ChartCardColor` vocabulary, kept as its own local type since this block has no dependency on `ChartCard`. */
type BillingSummaryColor =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'neutral'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger';

interface BillingSummaryItem {
  label: string;
  /** Current usage, `0`-`max`. */
  value: number;
  max: number;
  /** @default 'primary' */
  color?: BillingSummaryColor;
  /** Formats the value line next to the label, e.g. `(value, max) => \`${value} GB of ${max} GB\`` — falls back to a plain `"value / max"`. */
  formatValue?: (value: number, max: number) => string;
}

interface BillingSummaryCardProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  items: BillingSummaryItem[];
  className?: string;
}

/**
 * A progress-list breakdown card — one labeled `Progress` bar per category,
 * the "storage used by file type" / "budget spent by category" pattern
 * from Minimals' File and Banking dashboard homes. Distinct from
 * `ChartCard`'s `gauge` type: a gauge is one scalar against one max, this
 * is several independent value/max pairs stacked in a list — reach for
 * `gauge` for "one number," this for "a breakdown."
 *
 * @example
 * ```tsx
 * <BillingSummaryCard
 *   title="Storage"
 *   description="20 GB plan"
 *   items={[
 *     { label: 'Documents', value: 8, max: 20, color: 'primary', formatValue: (v, m) => `${v} GB of ${m} GB` },
 *     { label: 'Images', value: 5, max: 20, color: 'info', formatValue: (v, m) => `${v} GB of ${m} GB` },
 *   ]}
 * />
 * ```
 */
function BillingSummaryCard(props: BillingSummaryCardProps) {
  const { title, description, items, className } = props;

  return (
    <Card variant="outlined" className={cn('flex flex-col', className)}>
      <CardHeader bordered={false}>
        <CardTitle className="text-base">{title}</CardTitle>
        {description ? <Text className="text-sm opacity-70">{description}</Text> : null}
      </CardHeader>
      <CardContent className="flex flex-col gap-4 pt-0">
        {items.map((item) => (
          <div key={item.label} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-2">
              <Text className="text-sm font-medium">{item.label}</Text>
              <Text className="text-xs opacity-70">
                {item.formatValue ? item.formatValue(item.value, item.max) : `${item.value} / ${item.max}`}
              </Text>
            </div>
            <Progress value={item.value} max={item.max} color={item.color ?? 'primary'} aria-label={item.label} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export { BillingSummaryCard };
export type { BillingSummaryCardProps, BillingSummaryItem, BillingSummaryColor };
