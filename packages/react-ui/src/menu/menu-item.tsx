import { MenuItem as HeadlessMenuItem } from '@nebula-lab/headless/menu';
import { cn } from '@nebula-lab/primitives/cn';
import * as React from 'react';

import type { MenuItemProps as HeadlessMenuItemProps } from '@nebula-lab/headless/menu';

type MenuItemProps = HeadlessMenuItemProps;

/** Highlights on real `:focus` (plain, not `:focus-visible`) — a `MenuItem` genuinely moves DOM focus for both keyboard nav and pointer-hover (see the headless source's `onPointerMove` handler), unlike `Command`/`Combobox`'s items, which only ever get a *virtual* highlight while real focus stays on their input. */
const MenuItem = React.forwardRef<HTMLDivElement, MenuItemProps>((props, forwardedRef) => {
  const { className, ...rest } = props;
  return (
    <HeadlessMenuItem
      className={cn(
        'flex cursor-pointer items-center gap-2 rounded-[var(--radius-selector)] px-2 py-1.5 text-sm outline-none focus:bg-[var(--menu-item-focus-bg)] data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
        className,
      )}
      {...rest}
      ref={forwardedRef}
    />
  );
});

MenuItem.displayName = 'MenuItem';

export { MenuItem };
export type { MenuItemProps };
