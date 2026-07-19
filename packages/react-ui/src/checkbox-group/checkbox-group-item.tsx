import { CheckboxGroupItem as HeadlessCheckboxGroupItem } from '@nebula-lab/headless/checkbox-group';
import { cn } from '@nebula-lab/primitives/cn';
import * as React from 'react';

import type { CheckboxGroupItemProps as HeadlessCheckboxGroupItemProps } from '@nebula-lab/headless/checkbox-group';

type CheckboxGroupItemProps = HeadlessCheckboxGroupItemProps;

/** Same box + checkmark treatment as this package's own `Checkbox` (see that component's doc comment) — the headless source renders the identical underlying `Checkbox` DOM structure per item, this only exists as a thin wrapper because item styling needs re-applying since we can't wrap `react-ui`'s already-styled `Checkbox` (the group needs its own checked-state wiring underneath, not a plain checked prop). */
const CheckboxGroupItem = React.forwardRef<HTMLButtonElement, CheckboxGroupItemProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <HeadlessCheckboxGroupItem
        className={cn(
          'group inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-[var(--radius-selector)] border border-[var(--checkbox-border)] bg-[var(--checkbox-bg)] transition-colors data-[state=checked]:border-[var(--checkbox-checked-border)] data-[state=checked]:bg-[var(--checkbox-checked-bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--checkbox-checked-border)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
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
      </HeadlessCheckboxGroupItem>
    );
  },
);

CheckboxGroupItem.displayName = 'CheckboxGroupItem';

export { CheckboxGroupItem };
export type { CheckboxGroupItemProps };
