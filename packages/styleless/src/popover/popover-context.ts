import { createContextScope } from '@nebula/primitives/create-context-scope';
import { createPopperScope } from '@nebula/primitives/popper';

import type { Scope } from '@nebula/primitives/create-context-scope';

interface PopoverContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contentId: string;
}

const POPOVER_NAME = 'Popover';

/**
 * Composes its own scope with `@nebula/primitives`' `Popper` scope (passed
 * as a context-scope dependency, per `createContextScope`'s `deps`
 * parameter) — so a single `__scopePopover` prop threads through to both
 * `Popover`'s own context *and* the `Popper` positioning context underneath
 * it, without consumers ever needing to think about `Popper` separately.
 */
const [createPopoverContext, createPopoverScope] = createContextScope(POPOVER_NAME, [
  createPopperScope,
]);
const usePopperScope = createPopperScope();
const [PopoverProvider, usePopoverContext] =
  createPopoverContext<PopoverContextValue>(POPOVER_NAME);

/** Every consumer prop object accepts an optional internal `__scopePopover` prop threaded through by `createPopoverScope` — not part of the public API. */
type ScopedProps<P> = P & { __scopePopover?: Scope<PopoverContextValue> };

export { POPOVER_NAME, PopoverProvider, usePopoverContext, createPopoverScope, usePopperScope };
export type { PopoverContextValue, ScopedProps };
