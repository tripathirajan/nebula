import { createContextScope } from '@nebula-lab/primitives/create-context-scope';

import type { Scope } from '@nebula-lab/primitives/create-context-scope';

interface TreeContextValue {
  /** Abstracts over the `single`/`multiple` value-shape difference, same technique `ListboxContextValue.isItemSelected` uses. */
  isItemSelected: (value: string) => boolean;
  onItemSelectedChange: (value: string, selected: boolean) => void;
  isItemExpanded: (value: string) => boolean;
  onItemExpandedChange: (value: string, expanded: boolean) => void;
  /** The value of the one `TreeItemTrigger` currently in the roving-tabindex
   * sequence (`tabIndex={0}`) — every other trigger is `tabIndex={-1}`.
   * `undefined` until either an item is focused or the first `TreeItemTrigger`
   * registers itself (see `registerItem`). */
  activeValue: string | undefined;
  setActiveValue: (value: string) => void;
  /** Called once by each `TreeItemTrigger` on mount so the tree can default
   * `activeValue` to the first-rendered item — without this, no item would
   * have `tabIndex={0}` and the whole tree would be untabbable until a click. */
  registerItem: (value: string) => void;
  disabled: boolean;
}

const TREE_NAME = 'Tree';

/**
 * Scoped context factory for the Tree root — mirrors every other compound
 * component's use of `createContextScope`.
 */
const [createTreeContext, createTreeScope] = createContextScope(TREE_NAME);
const [TreeProvider, useTreeContext] = createTreeContext<TreeContextValue>(TREE_NAME);

/** Every consumer prop object accepts an optional internal `__scopeTree` prop threaded through by `createTreeScope` — not part of the public API. */
type ScopedProps<P> = P & { __scopeTree?: Scope<TreeContextValue> };

export { TREE_NAME, TreeProvider, useTreeContext, createTreeScope };
export type { TreeContextValue, ScopedProps };
