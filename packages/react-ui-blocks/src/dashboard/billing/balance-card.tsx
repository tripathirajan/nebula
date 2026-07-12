import { cn } from '@nebula/primitives/cn';
import { Button } from '@nebula/react-ui/button';
import { Card, CardContent } from '@nebula/react-ui/card';
import { Text } from '@nebula/react-ui/text';
import * as React from 'react';

interface BalanceCardAction {
  label: string;
  onClick?: () => void;
  href?: string;
}

interface BalanceCardProps {
  /** e.g. "Total balance". */
  label: React.ReactNode;
  /** Pre-formatted by the consumer (e.g. `"$24,500.00"`) — same convention `DashboardOverview`'s `Stat` value uses, since currency/locale formatting is a consumer concern. */
  amount: React.ReactNode;
  /** e.g. "+2.5% from last month". */
  description?: React.ReactNode;
  /** 1-3 quick actions rendered as a button row below the amount (e.g. "Send", "Top up"). The first action renders filled (`color="primary"`), the rest render as `variant="ghost"` — the common "one primary CTA, n secondary" quick-action-panel shape. */
  actions?: BalanceCardAction[];
  className?: string;
}

/**
 * A balance summary card with a row of quick-action buttons underneath —
 * the "current balance + Send/Top-up" panel that leads Minimals' Banking
 * home page. Deliberately not built on `DashboardOverview`'s `Stat` grid:
 * a balance card is always exactly one figure plus action buttons, not a
 * multi-metric grid, so reusing `DashboardOverview` here would mean
 * suppressing most of its grid/multi-metric machinery for a shape it
 * isn't actually built for — a new, small, single-purpose block instead.
 *
 * @example
 * ```tsx
 * <BalanceCard
 *   label="Total balance"
 *   amount="$24,500.00"
 *   description="+2.5% from last month"
 *   actions={[
 *     { label: 'Send', onClick: () => {} },
 *     { label: 'Top up', onClick: () => {} },
 *   ]}
 * />
 * ```
 */
function BalanceCard(props: BalanceCardProps) {
  const { label, amount, description, actions, className } = props;

  return (
    <Card variant="outlined" className={cn('flex flex-col', className)}>
      <CardContent className="flex flex-col gap-1">
        <Text className="text-sm opacity-70">{label}</Text>
        <Text className="text-3xl font-bold">{amount}</Text>
        {description ? <Text className="text-sm opacity-70">{description}</Text> : null}
        {actions && actions.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {actions.map((action, index) =>
              action.href ? (
                <Button
                  key={action.label}
                  asChild
                  size="sm"
                  variant={index === 0 ? 'default' : 'ghost'}
                  color="primary"
                >
                  <a href={action.href}>{action.label}</a>
                </Button>
              ) : (
                <Button
                  key={action.label}
                  size="sm"
                  variant={index === 0 ? 'default' : 'ghost'}
                  color="primary"
                  onClick={action.onClick}
                >
                  {action.label}
                </Button>
              ),
            )}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

export { BalanceCard };
export type { BalanceCardProps, BalanceCardAction };
