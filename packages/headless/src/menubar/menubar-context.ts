import { createContextScope } from '@nebula-lab/primitives/create-context-scope';

import type { Scope } from '@nebula-lab/primitives/create-context-scope';

interface MenubarContextValue {
  /** Which `MenubarMenu`'s `value` is currently open, or `undefined` if none is. */
  value: string | undefined;
  onValueChange: (value: string | undefined) => void;
}

const MENUBAR_NAME = 'Menubar';

/**
 * `Menubar`'s own scope — deliberately *not* composed with `Popper`'s or
 * `Menu`'s scope (unlike `Menu` itself composing `Popper`'s): each
 * `MenubarMenu` mints its own ordinary (unscoped) `Menu` instance with its
 * own `__scopeMenu`, so there's no shared lower-level primitive scope for
 * `Menubar` to thread through here — only "which menu is open" needs to be
 * shared across sibling `MenubarMenu`s, which is exactly what this context
 * carries.
 */
const [createMenubarContext, createMenubarScope] = createContextScope(MENUBAR_NAME);
const [MenubarProvider, useMenubarContext] =
  createMenubarContext<MenubarContextValue>(MENUBAR_NAME);

/** Every `Menubar`/`MenubarMenu`/`MenubarTrigger` prop object accepts an internal `__scopeMenubar`, threaded through by `createMenubarScope`. */
type ScopedProps<P> = P & { __scopeMenubar?: Scope<MenubarContextValue> };

export { MENUBAR_NAME, MenubarProvider, useMenubarContext, createMenubarScope };
export type { MenubarContextValue, ScopedProps };
