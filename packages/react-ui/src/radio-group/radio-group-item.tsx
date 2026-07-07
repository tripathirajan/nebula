import { RadioGroupItem as HeadlessRadioGroupItem } from '@nebula/headless/radio-group';
import { cn } from '@nebula/primitives/cn';
import * as React from 'react';

import type { RadioGroupItemProps as HeadlessRadioGroupItemProps } from '@nebula/headless/radio-group';

type RadioGroupItemProps = HeadlessRadioGroupItemProps;

/**
 * Styled wrapper around `@nebula/headless`'s `RadioGroupItem`. Note the
 * underlying `headless` item is itself the full clickable control — its
 * `children` become the accessible name (see its stories:
 * `<RadioGroupItem value="compact">Compact</RadioGroupItem>`), not a
 * separate `<label>` next to a bare circle. So this layer renders a small
 * indicator circle (`--radio-*` tokens, see `../tokens/component.ts`,
 * toggled via `data-state` with the same `group`/`group-data-*` technique
 * `Checkbox`/`Switch` use) *followed by* the consumer's `children`, both
 * inside the one clickable item, rather than trying to separate them into
 * two elements.
 *
 * @example
 * ```tsx
 * <RadioGroup defaultValue="comfortable" aria-label="Density">
 *   <RadioGroupItem value="compact">Compact</RadioGroupItem>
 *   <RadioGroupItem value="comfortable">Comfortable</RadioGroupItem>
 * </RadioGroup>
 * ```
 */
const RadioGroupItem = React.forwardRef<HTMLButtonElement, RadioGroupItemProps>(
  (props, forwardedRef) => {
    const { className, children, ...rest } = props;
    return (
      <HeadlessRadioGroupItem
        className={cn(
          'group inline-flex items-center gap-2 rounded-[var(--radius-selector)] text-sm text-[var(--radio-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--radio-checked-border)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...rest}
        ref={forwardedRef}
      >
        <span className="relative inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-[var(--radio-border)] transition-colors group-data-[state=checked]:border-[var(--radio-checked-border)]">
          <span
            aria-hidden="true"
            className="hidden h-2 w-2 rounded-full bg-[var(--radio-checked-dot)] group-data-[state=checked]:block"
          />
        </span>
        {children}
      </HeadlessRadioGroupItem>
    );
  },
);

RadioGroupItem.displayName = 'RadioGroupItem';

export { RadioGroupItem };
export type { RadioGroupItemProps };
