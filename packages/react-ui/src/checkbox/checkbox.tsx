import { Checkbox as HeadlessCheckbox } from '@nebula/headless/checkbox';
import { cn } from '@nebula/primitives/cn';
import * as React from 'react';

import type { CheckboxProps as HeadlessCheckboxProps } from '@nebula/headless/checkbox';

type CheckboxProps = HeadlessCheckboxProps;

/**
 * Styled wrapper around `@nebula/headless`'s `Checkbox` — tri-state
 * behavior (`checked`/`false`/`'indeterminate'`), keyboard handling
 * (Space), and hidden-native-input form participation all come from there
 * unchanged. This layer only adds the box's visual styling (`--checkbox-*`
 * tokens, see `../tokens/component.ts`) and the two built-in indicator
 * icons (checkmark / dash), each toggled via `data-state` using the
 * `group`/`group-data-*` pattern (same technique `AccordionTrigger`'s
 * chevron uses) rather than a separate `CheckboxIndicator` subcomponent —
 * there's only ever one of two fixed icons, so a customizable-children slot
 * would be unused complexity.
 *
 * @example
 * ```tsx
 * const [checked, setChecked] = useState(false);
 * <Checkbox checked={checked} onCheckedChange={setChecked} aria-label="Accept terms" />
 * ```
 */
const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>((props, forwardedRef) => {
  const { className, ...rest } = props;
  return (
    <HeadlessCheckbox
      className={cn(
        'group inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-[var(--radius-selector)] border border-[var(--checkbox-border)] bg-[var(--checkbox-bg)] transition-colors data-[state=checked]:border-[var(--checkbox-checked-border)] data-[state=checked]:bg-[var(--checkbox-checked-bg)] data-[state=indeterminate]:border-[var(--checkbox-checked-border)] data-[state=indeterminate]:bg-[var(--checkbox-checked-bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--checkbox-checked-border)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...rest}
      ref={forwardedRef}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="hidden h-3 w-3 text-[var(--checkbox-icon)] group-data-[state=checked]:block"
      >
        <path d="M20 6 9 17l-5-5" />
      </svg>
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
        className="hidden h-3 w-3 text-[var(--checkbox-icon)] group-data-[state=indeterminate]:block"
      >
        <path d="M5 12h14" />
      </svg>
    </HeadlessCheckbox>
  );
});

Checkbox.displayName = 'Checkbox';

export { Checkbox };
export type { CheckboxProps };
