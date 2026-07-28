
import { useControllableState, useId } from '@nebula-lab/hooks';
import { Popper } from '@nebula-lab/primitives/popper';
import * as React from 'react';


import { MenuProvider, usePopperScope } from './menu-context';

import type { ScopedProps } from './menu-context';

interface MenuProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

/**
 * Root of the Menu compound component — the shared foundation `DropdownMenu`,
 * `ContextMenu`, and `Menubar` are all built on (same relationship `Popper`
 * has to `Popover`/`Tooltip`: one implementation, several triggers/contexts
 * on top of it). Wraps children in `@nebula-lab/primitives`' `Popper` for the
 * anchor-positioning `MenuTrigger`/`MenuContent` need.
 *
 * Deliberately simplified vs. a full Radix-parity menu: no submenus
 * (`MenuSub`/`MenuSubTrigger`/`MenuSubContent`) and no typeahead
 * (type-to-jump-to-item) — both real, valuable features, scoped out here to
 * keep this a tractable single build alongside `DropdownMenu`/`ContextMenu`/
 * `Menubar`. Also: opening via `ArrowUp` on the trigger focuses the first
 * item, not the last (the full WAI-ARIA APG menu-button pattern focuses the
 * *last* item on `ArrowUp` open) — same reasoning, documented rather than
 * silently different.
 *
 * @example
 * ```tsx
 * <Menu>
 *   <MenuTrigger>Options</MenuTrigger>
 *   <MenuPortal>
 *     <MenuContent>
 *       <MenuItem onSelect={() => save()}>Save</MenuItem>
 *       <MenuSeparator />
 *       <MenuItem onSelect={() => remove()} disabled>Delete</MenuItem>
 *     </MenuContent>
 *   </MenuPortal>
 * </Menu>
 * ```
 */
function Menu(props: ScopedProps<MenuProps>) {
  const { __scopeMenu, open: openProp, defaultOpen = false, onOpenChange, children } = props;
  const popperScope = usePopperScope(__scopeMenu);

  const [open, setOpen] = useControllableState<boolean>({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  });

  const contentId = useId('nebula-menu-content');

  return (
    <Popper {...popperScope}>
      <MenuProvider scope={__scopeMenu} open={open} onOpenChange={setOpen} contentId={contentId}>
        {children}
      </MenuProvider>
    </Popper>
  );
}

export { Menu };
export type { MenuProps };
