import { cn } from '@nebula-lab/primitives/cn';
import { Badge } from '@nebula-lab/react-ui/badge';
import { Button } from '@nebula-lab/react-ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@nebula-lab/react-ui/card';
import { IconButton } from '@nebula-lab/react-ui/icon-button';
import { List, ListItem } from '@nebula-lab/react-ui/list';
import { Menu, MenuContent, MenuItem, MenuPortal, MenuTrigger } from '@nebula-lab/react-ui/menu';
import { Text } from '@nebula-lab/react-ui/text';

interface PaymentMethod {
  id: string;
  /** e.g. "Visa", "Mastercard" — displayed as plain text, no card-brand icon set. */
  brand: string;
  last4: string;
  /** e.g. "08/27". */
  expiry: string;
  isDefault?: boolean;
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
}

function CardIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-8 w-11 shrink-0 rounded-[var(--radius-selector)] border border-[var(--card-border)] p-1.5">
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
  const { methods, onSetDefault, onRemove, onAdd, className } = props;
  const hasRowActions = Boolean(onSetDefault || onRemove);

  return (
    <Card variant="outlined" className={cn('flex flex-col', className)}>
      <CardHeader bordered={false}>
        <CardTitle className="text-base">Payment methods</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 pt-0">
        <List className="flex flex-col gap-3">
          {methods.map((method) => (
            <ListItem key={method.id} className="flex items-center gap-3">
              <CardIcon />
              <div className="flex flex-1 flex-col">
                <div className="flex items-center gap-2">
                  <Text className="text-sm font-medium">
                    {method.brand} •••• {method.last4}
                  </Text>
                  {method.isDefault ? (
                    <Badge color="neutral" className="text-[10px]">
                      Default
                    </Badge>
                  ) : null}
                </div>
                <Text className="text-xs opacity-70">Expires {method.expiry}</Text>
              </div>
              {hasRowActions ? (
                <Menu>
                  <MenuTrigger asChild>
                    <IconButton aria-label={`Actions for ${method.brand} ending in ${method.last4}`} size="sm">
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
          <Button variant="ghost" color="primary" size="sm" className="self-start" onClick={onAdd}>
            + Add payment method
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}

export { PaymentMethodList };
export type { PaymentMethodListProps, PaymentMethod };
