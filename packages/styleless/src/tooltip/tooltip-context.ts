import { createContextScope } from '@nebula/primitives/create-context-scope';
import { createPopperScope } from '@nebula/primitives/popper';

import type { Scope } from '@nebula/primitives/create-context-scope';

interface TooltipContextValue {
  open: boolean;
  contentId: string;
  /** Called by `TooltipTrigger` on pointer enter / focus — starts (or skips) the open delay. */
  onTriggerEnter: () => void;
  /** Called by `TooltipTrigger` on pointer leave / blur — closes immediately, cancelling any pending open timer. */
  onTriggerLeave: () => void;
  /** Called by `TooltipTrigger` on click — suppresses the tooltip reopening from the focus event a click also produces. */
  onTriggerClick: () => void;
  /** Called by `TooltipContent` on Escape — closes immediately, same as a pointer-leave. */
  onClose: () => void;
}

const TOOLTIP_NAME = 'Tooltip';

/**
 * Composes its own scope with `@nebula/primitives`' `Popper` scope, same
 * pattern as `Popover` — a single `__scopeTooltip` prop threads through to
 * both `Tooltip`'s own context and the `Popper` positioning context
 * `TooltipTrigger`/`TooltipContent` are built on.
 */
const [createTooltipContext, createTooltipScope] = createContextScope(TOOLTIP_NAME, [
  createPopperScope,
]);
const usePopperScope = createPopperScope();
const [TooltipProvider, useTooltipContext] =
  createTooltipContext<TooltipContextValue>(TOOLTIP_NAME);

/** Every consumer prop object accepts an optional internal `__scopeTooltip` prop threaded through by `createTooltipScope` — not part of the public API. */
type ScopedProps<P> = P & { __scopeTooltip?: Scope<TooltipContextValue> };

export { TOOLTIP_NAME, TooltipProvider, useTooltipContext, createTooltipScope, usePopperScope };
export type { TooltipContextValue, ScopedProps };
