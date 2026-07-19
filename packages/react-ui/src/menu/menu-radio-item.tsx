import { MenuRadioItem as HeadlessMenuRadioItem } from '@nebula-lab/headless/menu';
import { cn } from '@nebula-lab/primitives/cn';
import * as React from 'react';

import type { MenuRadioItemProps as HeadlessMenuRadioItemProps } from '@nebula-lab/headless/menu';

type MenuRadioItemProps = HeadlessMenuRadioItemProps;

/** Same row treatment as `MenuCheckboxItem`, but a dot instead of a checkmark — the visual `RadioGroupItem` uses for the same "one selected of many" relationship. */
const MenuRadioItem = React.forwardRef<HTMLDivElement, MenuRadioItemProps>(
  (props, forwardedRef) => {
    const { className, children, ...rest } = props;
    return (
      <HeadlessMenuRadioItem
        className={cn(
          'group relative flex cursor-pointer items-center gap-2 rounded-[var(--radius-selector)] py-1.5 pl-7 pr-2 text-sm outline-none focus:bg-[var(--menu-item-focus-bg)] data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
          className,
        )}
        {...rest}
        ref={forwardedRef}
      >
        <span className="absolute left-2 hidden h-1.5 w-1.5 rounded-full bg-current group-data-[state=checked]:block" />
        {children}
      </HeadlessMenuRadioItem>
    );
  },
);

MenuRadioItem.displayName = 'MenuRadioItem';

export { MenuRadioItem };
export type { MenuRadioItemProps };
