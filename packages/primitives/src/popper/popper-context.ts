import { createContextScope } from '../create-context-scope/create-context-scope';

import type { Scope } from '../create-context-scope/create-context-scope';

interface PopperContextValue {
  anchor: HTMLElement | null;
  onAnchorChange: (anchor: HTMLElement | null) => void;
}

const POPPER_NAME = 'Popper';

/**
 * Scoped context factory for Popper — same `createContextScope` pattern as
 * every other compound primitive (`RovingFocusGroup`, `Tabs` in
 * `@nebula/headless`, ...), so a `Popper` nested inside another one (a
 * submenu anchored off a popover, say) mints its own anchor reference
 * instead of colliding with the outer one's.
 */
const [createPopperContext, createPopperScope] = createContextScope(POPPER_NAME);
const [PopperProvider, usePopperContext] = createPopperContext<PopperContextValue>(POPPER_NAME);

/** Every `Popper`/`PopperAnchor`/`PopperContent` prop object accepts an internal `__scopePopper`, threaded through by `createPopperScope`. */
type ScopedProps<P> = P & { __scopePopper?: Scope<PopperContextValue> };

export { POPPER_NAME, PopperProvider, usePopperContext, createPopperScope };
export type { PopperContextValue, ScopedProps };
