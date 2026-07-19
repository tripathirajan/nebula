import { createContextScope } from '@nebula-lab/primitives/create-context-scope';
import { createPopperScope } from '@nebula-lab/primitives/popper';

import type { Scope } from '@nebula-lab/primitives/create-context-scope';

interface HoverCardContextValue {
  open: boolean;
  contentId: string;
  onTriggerEnter: () => void;
  onTriggerLeave: () => void;
  onContentEnter: () => void;
  onContentLeave: () => void;
  onClose: () => void;
}

const HOVER_CARD_NAME = 'HoverCard';

/**
 * Composes its own scope with `@nebula-lab/primitives`' `Popper` scope, same as
 * `Popover`'s context — `HoverCardContent` is anchor-positioned against
 * `HoverCardTrigger` exactly like `PopoverContent` is.
 */
const [createHoverCardContext, createHoverCardScope] = createContextScope(HOVER_CARD_NAME, [
  createPopperScope,
]);
const usePopperScope = createPopperScope();
const [HoverCardProvider, useHoverCardContext] =
  createHoverCardContext<HoverCardContextValue>(HOVER_CARD_NAME);

/** Every consumer prop object accepts an optional internal `__scopeHoverCard` prop threaded through by `createHoverCardScope` — not part of the public API. */
type ScopedProps<P> = P & { __scopeHoverCard?: Scope<HoverCardContextValue> };

export {
  HOVER_CARD_NAME,
  HoverCardProvider,
  useHoverCardContext,
  createHoverCardScope,
  usePopperScope,
};
export type { HoverCardContextValue, ScopedProps };
