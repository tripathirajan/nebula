import { createContextScope } from '@nebula/primitives/create-context-scope';

import type { Scope } from '@nebula/primitives/create-context-scope';

interface NavigationMenuContextValue {
  /** Which `NavigationMenuItem`'s `value` currently has its content open — at most one at a time, mirrors `MenubarContextValue.value`. */
  value: string | undefined;
  onValueChange: (value: string | undefined) => void;
  /** Hover delay (ms) before opening a trigger's content, when nothing else in the menu is already open. @default 200 */
  openDelay: number;
  /** Hover delay (ms) before closing, once the pointer leaves both the trigger and its content. @default 300 */
  closeDelay: number;
  /** Arms the shared close timer — called by both `NavigationMenuTrigger` and `NavigationMenuContent` on pointer-leave, since either one losing the pointer should (eventually) close the menu unless the pointer lands on the other. */
  startCloseTimer: () => void;
  /** Disarms the shared close timer — called on pointer-enter of either the trigger or the content. */
  cancelCloseTimer: () => void;
}

const NAVIGATION_MENU_NAME = 'NavigationMenu';

/**
 * Scoped context factory for the NavigationMenu root — mirrors every other
 * compound component's use of `createContextScope`. Deliberately *not*
 * composed with `Popover`'s scope (same reasoning as `menubar-context.ts`):
 * each `NavigationMenuItem` mints its own ordinary, unscoped `Popover`, so
 * there's no shared lower-level scope to thread through here — only "which
 * item is open" plus the shared hover-intent timers need to be shared across
 * sibling items.
 */
const [createNavigationMenuContext, createNavigationMenuScope] =
  createContextScope(NAVIGATION_MENU_NAME);
const [NavigationMenuProvider, useNavigationMenuContext] =
  createNavigationMenuContext<NavigationMenuContextValue>(NAVIGATION_MENU_NAME);

/** Every consumer prop object accepts an optional internal `__scopeNavigationMenu` prop threaded through by `createNavigationMenuScope` — not part of the public API. */
type ScopedProps<P> = P & { __scopeNavigationMenu?: Scope<NavigationMenuContextValue> };

export {
  NAVIGATION_MENU_NAME,
  NavigationMenuProvider,
  useNavigationMenuContext,
  createNavigationMenuScope,
};
export type { NavigationMenuContextValue, ScopedProps };
