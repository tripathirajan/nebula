import { cn } from '@nebula/primitives/cn';
import { Badge } from '@nebula/react-ui/badge';
import { List, ListItem } from '@nebula/react-ui/list';
import { RadioGroup, RadioGroupItem } from '@nebula/react-ui/radio-group';
import { Text } from '@nebula/react-ui/text';
import * as React from 'react';

interface PlanCardsPlan {
  value: string;
  name: string;
  /** Pre-formatted by the consumer (e.g. `"$29"`) — same "no currency/locale formatting here" convention `BalanceCard`'s `amount` documents. */
  price: React.ReactNode;
  /** e.g. "/month". */
  period?: React.ReactNode;
  description?: React.ReactNode;
  features: string[];
  /** e.g. "Most popular" — renders as a `Badge` in the card's top-right corner. */
  badge?: string;
}

interface PlanCardsProps {
  plans: PlanCardsPlan[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** `RadioGroup`'s accessible name — required, since there's no visible group label otherwise. */
  'aria-label': string;
  className?: string;
}

function CheckIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4 shrink-0 text-[var(--color-success)]">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

/**
 * Plan comparison cards — the pricing-tier selector from Minimals' Account
 * → Billing settings tab (§3.10 SaaS/Billing → "Plan Comparison Cards").
 * Built on `RadioGroup`/`RadioGroupItem` rather than a row of plain
 * `Card`s with click handlers: a plan picker is fundamentally a
 * single-choice input, and `RadioGroup` already gives correct
 * roving-tabindex arrow-key navigation and `aria-checked` state for free.
 * Each `RadioGroupItem` is styled as a full card (`grid-cols-[auto_1fr]`
 * places the built-in radio dot beside the card's content instead of
 * `RadioGroupItem`'s own default inline layout) rather than adding a
 * separate "Select" button inside each card — a button nested inside
 * another interactive control (the radio item itself) would be an invalid
 * ARIA structure, so the whole card is the one clickable target.
 *
 * @example
 * ```tsx
 * <PlanCards
 *   aria-label="Choose a plan"
 *   value={plan}
 *   onValueChange={setPlan}
 *   plans={[
 *     { value: 'starter', name: 'Starter', price: '$0', period: '/month', features: ['1 project', 'Community support'] },
 *     { value: 'pro', name: 'Pro', price: '$29', period: '/month', badge: 'Most popular', features: ['Unlimited projects', 'Priority support'] },
 *   ]}
 * />
 * ```
 */
function PlanCards(props: PlanCardsProps) {
  const { plans, value, defaultValue, onValueChange, className, ...rest } = props;
  const ariaLabel = rest['aria-label'];

  return (
    <RadioGroup
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      aria-label={ariaLabel}
      className={cn('grid gap-4 sm:grid-cols-2 lg:grid-cols-3', className)}
    >
      {plans.map((plan) => (
        <RadioGroupItem
          key={plan.value}
          value={plan.value}
          className="relative grid grid-cols-[auto_1fr] items-start gap-x-3 rounded-[var(--radius-box)] border border-[var(--card-border)] bg-[var(--card-bg)] p-6 text-left data-[state=checked]:border-[var(--color-primary)] data-[state=checked]:ring-2 data-[state=checked]:ring-[var(--color-primary)]"
        >
          {plan.badge ? (
            <Badge color="primary" className="absolute -top-2.5 right-4">
              {plan.badge}
            </Badge>
          ) : null}
          <div className="flex flex-col gap-3">
            <div>
              <Text className="text-base font-semibold">{plan.name}</Text>
              {plan.description ? <Text className="text-sm opacity-70">{plan.description}</Text> : null}
            </div>
            <div className="flex items-baseline gap-1">
              <Text className="text-3xl font-bold">{plan.price}</Text>
              {plan.period ? <Text className="text-sm opacity-70">{plan.period}</Text> : null}
            </div>
            <List className="flex flex-col gap-1.5">
              {plan.features.map((feature) => (
                <ListItem key={feature} className="flex items-center gap-2 text-sm">
                  <CheckIcon />
                  {feature}
                </ListItem>
              ))}
            </List>
          </div>
        </RadioGroupItem>
      ))}
    </RadioGroup>
  );
}

export { PlanCards };
export type { PlanCardsProps, PlanCardsPlan };
