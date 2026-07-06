import { createContextScope } from '@nebula/primitives/create-context-scope';

import type { Scope } from '@nebula/primitives/create-context-scope';

interface CollapsibleContextValue {
  open: boolean;
  disabled: boolean;
  onOpenToggle: () => void;
  contentId: string;
}

const COLLAPSIBLE_NAME = 'Collapsible';

/**
 * Scoped context factory for Collapsible — mirrors `Accordion`/`Dialog`'s use
 * of `createContextScope` so a `Collapsible` nested inside another one mints
 * its own context instead of colliding.
 */
const [createCollapsibleContext, createCollapsibleScope] = createContextScope(COLLAPSIBLE_NAME);
const [CollapsibleProvider, useCollapsibleContext] =
  createCollapsibleContext<CollapsibleContextValue>(COLLAPSIBLE_NAME);

/** Every consumer prop object accepts an optional internal `__scopeCollapsible` prop threaded through by `createCollapsibleScope` — not part of the public API. */
type ScopedProps<P> = P & { __scopeCollapsible?: Scope<CollapsibleContextValue> };

export { COLLAPSIBLE_NAME, CollapsibleProvider, useCollapsibleContext, createCollapsibleScope };
export type { CollapsibleContextValue, ScopedProps };
