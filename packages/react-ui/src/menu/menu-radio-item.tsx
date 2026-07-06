import { cn } from '@nebula/primitives/cn';
import { MenuRadioItem as StylelessMenuRadioItem } from '@nebula/styleless/menu';
import * as React from 'react';

import type { MenuRadioItemProps as StylelessMenuRadioItemProps } from '@nebula/styleless/menu';

type MenuRadioItemProps = StylelessMenuRadioItemProps;

/** Same row treatment as `MenuCheckboxItem`, but a dot instead of a checkmark — the visual `RadioGroupItem` uses for the same "one selected of many" relationship. */
const MenuRadioItem = React.forwardRef<HTMLDivElement, MenuRadioItemProps>(
  (props, forwardedRef) => {
    const { className, children, ...rest } = props;
    return (
      <StylelessMenuRadioItem
        className={cn(
          'group relative flex cursor-pointer items-center gap-2 rounded-[var(--radius-selector)] py-1.5 pl-7 pr-2 text-sm outline-none focus:bg-[var(--menu-item-focus-bg)] data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
          className,
        )}
        {...rest}
        ref={forwardedRef}
      >
        <span className="absolute left-2 hidden h-1.5 w-1.5 rounded-full bg-current group-data-[state=checked]:block" />
        {children}
      </StylelessMenuRadioItem>
    );
  },
);

MenuRadioItem.displayName = 'MenuRadioItem';

export { MenuRadioItem };
export type { MenuRadioItemProps };
