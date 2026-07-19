import { createContextScope } from '@nebula-lab/primitives/create-context-scope';
import { createPopperScope } from '@nebula-lab/primitives/popper';

import type { Scope } from '@nebula-lab/primitives/create-context-scope';

interface MenuContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contentId: string;
}

const MENU_NAME = 'Menu';

/**
 * Composes its own scope with `@nebula-lab/primitives`' `Popper` scope — same
 * pattern as `Popover`/`Tooltip` — so a single `__scopeMenu` prop threads
 * through to both `Menu`'s own context and the `Popper` positioning context
 * `MenuTrigger`/`MenuContent` are built on.
 */
const [createMenuContext, createMenuScope] = createContextScope(MENU_NAME, [createPopperScope]);
const usePopperScope = createPopperScope();
const [MenuProvider, useMenuContext] = createMenuContext<MenuContextValue>(MENU_NAME);

/** Every consumer prop object accepts an optional internal `__scopeMenu` prop threaded through by `createMenuScope` — not part of the public API. */
type ScopedProps<P> = P & { __scopeMenu?: Scope<MenuContextValue> };

export { MENU_NAME, MenuProvider, useMenuContext, createMenuScope, usePopperScope };
export type { MenuContextValue, ScopedProps };
