import { cn } from '@nebula-lab/primitives/cn';

import { Button } from '../../actions/button/button';
import { IconButton } from '../../actions/icon-button/icon-button';
import { Menu, MenuContent, MenuItem, MenuPortal, MenuTrigger } from '../../overlays/menu';
import { Text } from '../../typography/text/text';
import { Badge } from '../badge/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../card';
import { List, ListItem } from '../list';

interface PaymentMethod {
  id: string;
  /** e.g. "Visa", "Mastercard" — displayed as plain text, no card-brand icon set. */
  brand: string;
  last4: string;
  /** e.g. "08/27". */
  expiry: string;
  isDefault?: boolean;
}

/** One optional class per part, for restyling a slot without forking the whole component — e.g. `classNames={{ item: 'py-4' }}` to loosen row spacing. */
interface PaymentMethodListClassNames {
  root?: string;
  header?: string;
  title?: string;
  list?: string;
  item?: string;
  icon?: string;
  brand?: string;
  badge?: string;
  expiry?: string;
  actionsTrigger?: string;
  addButton?: string;
}

interface PaymentMethodListProps {
  methods: PaymentMethod[];
  /** Omit to hide the "Set as default" row action entirely. */
  onSetDefault?: (id: string) => void;
  /** Omit to hide the "Remove" row action entirely. */
  onRemove?: (id: string) => void;
  /** Omit to hide the "Add payment method" button. */
  onAdd?: () => void;
  className?: string;
  /** Per-slot class overrides — see `PaymentMethodListClassNames`. */
  classNames?: PaymentMethodListClassNames;
}

function CardIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className={cn(
        'h-8 w-11 shrink-0 rounded-[var(--radius-selector)] border border-[var(--card-border)] p-1.5',
        className,
      )}
    >
      <rect x="1" y="4" width="22" height="16" rx="2" />
      <path strokeLinecap="round" d="M1 9h22" />
    </svg>
  );
}

/**
 * A saved payment method list — Minimals' Account → Billing "Payment
 * Method Manager" (§3.10 SaaS/Billing). Row actions (`Menu`+`IconButton`
 * "⋮" trigger) match `DataTableBlock`'s row-actions convention exactly,
 * since both are the same "per-row overflow menu" shape; `onSetDefault`/
 * `onRemove` are independently optional so a read-only method list (no
 * management permission) can render with zero action affordances.
 *
 * @example
 * ```tsx
 * <PaymentMethodList
 *   methods={[{ id: '1', brand: 'Visa', last4: '4242', expiry: '08/27', isDefault: true }]}
 *   onSetDefault={(id) => {}}
 *   onRemove={(id) => {}}
 *   onAdd={() => {}}
 * />
 * ```
 */
function PaymentMethodList(props: PaymentMethodListProps) {
  const { methods, onSetDefault, onRemove, onAdd, className, classNames } = props;
  const hasRowActions = Boolean(onSetDefault || onRemove);

  return (
    <Card variant="outlined" className={cn('flex flex-col', className, classNames?.root)}>
      <CardHeader bordered={false} className={classNames?.header}>
        <CardTitle className={cn('text-base', classNames?.title)}>Payment methods</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 pt-0">
        <List className={cn('flex flex-col gap-3', classNames?.list)}>
          {methods.map((method) => (
            <ListItem key={method.id} className={cn('flex items-center gap-3', classNames?.item)}>
              <CardIcon className={classNames?.icon} />
              <div className="flex flex-1 flex-col">
                <div className="flex items-center gap-2">
                  <Text className={cn('text-sm font-medium', classNames?.brand)}>
                    {method.brand} •••• {method.last4}
                  </Text>
                  {method.isDefault ? (
                    <Badge color="neutral" className={cn('text-[10px]', classNames?.badge)}>
                      Default
                    </Badge>
                  ) : null}
                </div>
                <Text className={cn('text-xs opacity-70', classNames?.expiry)}>Expires {method.expiry}</Text>
              </div>
              {hasRowActions ? (
                <Menu>
                  <MenuTrigger asChild>
                    <IconButton
                      aria-label={`Actions for ${method.brand} ending in ${method.last4}`}
                      size="sm"
                      className={classNames?.actionsTrigger}
                    >
                      <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                        <circle cx="12" cy="5" r="1.5" />
                        <circle cx="12" cy="12" r="1.5" />
                        <circle cx="12" cy="19" r="1.5" />
                      </svg>
                    </IconButton>
                  </MenuTrigger>
                  <MenuPortal>
                    <MenuContent align="end">
                      {onSetDefault && !method.isDefault ? (
                        <MenuItem onSelect={() => onSetDefault(method.id)}>Set as default</MenuItem>
                      ) : null}
                      {onRemove ? <MenuItem onSelect={() => onRemove(method.id)}>Remove</MenuItem> : null}
                    </MenuContent>
                  </MenuPortal>
                </Menu>
              ) : null}
            </ListItem>
          ))}
        </List>
        {onAdd ? (
          <Button
            variant="ghost"
            color="primary"
            size="sm"
            className={cn('self-start', classNames?.addButton)}
            onClick={onAdd}
          >
            + Add payment method
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}

export { PaymentMethodList };
export type { PaymentMethodListProps, PaymentMethod };
