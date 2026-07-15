import { cn } from '@nebula/primitives/cn';
import { Card, CardContent, CardHeader, CardTitle } from '@nebula/react-ui/card';
import { List, ListItem } from '@nebula/react-ui/list';
import { Text } from '@nebula/react-ui/text';
import * as React from 'react';

interface RankedListItem {
  id: string;
  /** Overrides the auto-computed rank (1-indexed position in `items`) — pass when the list is a slice of a larger, already-ranked dataset. */
  rank?: number;
  /** e.g. a product name or country. */
  label: React.ReactNode;
  /** Pre-formatted by the consumer (e.g. `"$12,450"`), same convention `BalanceCard`'s `amount` documents. */
  value: React.ReactNode;
  /** Optional small leading visual (`Avatar`, product thumbnail, flag). */
  media?: React.ReactNode;
}

interface RankedListProps {
  title?: React.ReactNode;
  items: RankedListItem[];
  className?: string;
}

/**
 * A numbered ranking list — "Top products," "Top countries by revenue,"
 * the mini-table pattern from Minimals' Ecommerce/Booking dashboard homes
 * (§3.5 Data Display → *Comparison Table* / §3.8 Dashboard → *Activity*,
 * no single exact taxonomy name). Distinct from `ThumbnailList`: this one
 * is about *position* (a rank badge, ordered 1..n) — `ThumbnailList` is
 * about *change* (a trend indicator per item, no inherent order). Distinct
 * from `DataTableBlock`: no sorting/selection/pagination — this is a
 * fixed, pre-ranked, decorative-in-context list, not an interactive table.
 *
 * @example
 * ```tsx
 * <RankedList
 *   title="Top products"
 *   items={[
 *     { id: '1', label: 'Wireless earbuds', value: '$12,450' },
 *     { id: '2', label: 'Smart watch', value: '$9,800' },
 *   ]}
 * />
 * ```
 */
function RankedList(props: RankedListProps) {
  const { title, items, className } = props;

  return (
    <Card variant="outlined" className={cn('flex flex-col', className)}>
      {title ? (
        <CardHeader bordered={false}>
          <CardTitle className="text-base">{title}</CardTitle>
        </CardHeader>
      ) : null}
      <CardContent className={title ? 'pt-0' : undefined}>
        <List className="flex flex-col gap-3">
          {items.map((item, index) => (
            <ListItem key={item.id} className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-base-200)] text-xs font-semibold"
              >
                {item.rank ?? index + 1}
              </span>
              {item.media ? <span className="shrink-0">{item.media}</span> : null}
              <Text className="block flex-1 truncate text-sm font-medium">{item.label}</Text>
              <Text className="shrink-0 text-sm font-medium">{item.value}</Text>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}

export { RankedList };
export type { RankedListProps, RankedListItem };
