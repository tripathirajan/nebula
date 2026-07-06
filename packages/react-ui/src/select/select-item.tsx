import { cn } from '@nebula/primitives/cn';
import { SelectItem as StylelessSelectItem } from '@nebula/styleless/select';
import * as React from 'react';

import type { SelectItemProps as StylelessSelectItemProps } from '@nebula/styleless/select';

type SelectItemProps = StylelessSelectItemProps;

/** A built-in checkmark appears at `data-state=selected` — reads real DOM focus (`FocusItem`'s roving tabindex), not a virtual highlight the way `Command`'s items do, so this styles off `:focus-visible` rather than a `data-highlighted` attribute. */
const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>((props, forwardedRef) => {
  const { className, children, ...rest } = props;
  return (
    <StylelessSelectItem
      className={cn(
        'group relative flex cursor-pointer select-none items-center rounded-[var(--radius-selector)] py-1.5 pl-7 pr-2 text-sm outline-none focus-visible:bg-[var(--select-item-highlighted-bg)] data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
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
        className="absolute left-2 hidden h-3.5 w-3.5 group-data-[state=selected]:block"
      >
        <path d="M20 6 9 17l-5-5" />
      </svg>
      {children}
    </StylelessSelectItem>
  );
});

SelectItem.displayName = 'SelectItem';

export { SelectItem };
export type { SelectItemProps };
