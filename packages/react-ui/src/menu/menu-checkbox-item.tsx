import { cn } from '@nebula/primitives/cn';
import { MenuCheckboxItem as StylelessMenuCheckboxItem } from '@nebula/styleless/menu';
import * as React from 'react';

import type { MenuCheckboxItemProps as StylelessMenuCheckboxItemProps } from '@nebula/styleless/menu';

type MenuCheckboxItemProps = StylelessMenuCheckboxItemProps;

/** Same row treatment as `MenuItem`, plus a built-in checkmark shown at `data-state=checked` in a reserved left-hand slot. */
const MenuCheckboxItem = React.forwardRef<HTMLDivElement, MenuCheckboxItemProps>(
  (props, forwardedRef) => {
    const { className, children, ...rest } = props;
    return (
      <StylelessMenuCheckboxItem
        className={cn(
          'group relative flex cursor-pointer items-center gap-2 rounded-[var(--radius-selector)] py-1.5 pl-7 pr-2 text-sm outline-none focus:bg-[var(--menu-item-focus-bg)] data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
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
          className="absolute left-2 hidden h-3.5 w-3.5 group-data-[state=checked]:block"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
        {children}
      </StylelessMenuCheckboxItem>
    );
  },
);

MenuCheckboxItem.displayName = 'MenuCheckboxItem';

export { MenuCheckboxItem };
export type { MenuCheckboxItemProps };
