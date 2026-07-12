import { cn } from '@nebula/primitives/cn';
import { Card, CardContent, CardHeader, CardTitle } from '@nebula/react-ui/card';
import { List, ListItem } from '@nebula/react-ui/list';
import { Text } from '@nebula/react-ui/text';
import * as React from 'react';

interface ThumbnailListTrend {
  direction: 'up' | 'down';
  /** Pre-formatted by the consumer (e.g. `"+12%"`). */
  value: React.ReactNode;
}

interface ThumbnailListItem {
  id: string;
  /** A product image, `Avatar`, or any small leading visual. */
  thumbnail: React.ReactNode;
  label: React.ReactNode;
  description?: React.ReactNode;
  trend?: ThumbnailListTrend;
}

interface ThumbnailListProps {
  title?: React.ReactNode;
  items: ThumbnailListItem[];
  className?: string;
}

/** Same arrow glyph `DashboardOverview`'s internal `TrendArrow` renders — duplicated rather than imported since it's a two-path decorative SVG, not shared component logic, matching the "no icon dependency" convention every small inline icon in this repo already follows. */
function TrendArrow({ direction }: { direction: 'up' | 'down' }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={cn('h-3.5 w-3.5', direction === 'down' && 'rotate-180')}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  );
}

/**
 * A thumbnail-led list with a per-item trend indicator — "Best-selling
 * products this week" with a small change badge, the pattern from
 * Minimals' Ecommerce/Course dashboard homes. Distinct from `RankedList`:
 * this is about *change* (an up/down trend per item, no inherent order),
 * `RankedList` is about *position* (a 1..n rank badge, no trend).
 *
 * @example
 * ```tsx
 * <ThumbnailList
 *   title="Best sellers"
 *   items={[
 *     { id: '1', thumbnail: <img src="..." alt="" className="h-10 w-10 rounded-[var(--radius-box)] object-cover" />, label: 'Wireless earbuds', description: '320 sold', trend: { direction: 'up', value: '+12%' } },
 *   ]}
 * />
 * ```
 */
function ThumbnailList(props: ThumbnailListProps) {
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
          {items.map((item) => (
            <ListItem key={item.id} className="flex items-center gap-3">
              <span aria-hidden="true" className="shrink-0">
                {item.thumbnail}
              </span>
              <div className="flex flex-1 flex-col truncate">
                <Text className="truncate text-sm font-medium">{item.label}</Text>
                {item.description ? <Text className="text-xs opacity-70">{item.description}</Text> : null}
              </div>
              {item.trend ? (
                <span
                  className={cn(
                    'flex shrink-0 items-center gap-1 text-sm font-medium',
                    item.trend.direction === 'up'
                      ? 'text-[var(--color-success-text)]'
                      : 'text-[var(--color-error-text)]',
                  )}
                >
                  <TrendArrow direction={item.trend.direction} />
                  {item.trend.value}
                </span>
              ) : null}
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}

export { ThumbnailList };
export type { ThumbnailListProps, ThumbnailListItem, ThumbnailListTrend };
