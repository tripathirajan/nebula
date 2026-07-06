import { createContextScope } from '@nebula/primitives/create-context-scope';

import type { Scope } from '@nebula/primitives/create-context-scope';

interface TreeItemContextValue {
  value: string;
  selected: boolean;
  /** Whether this item has a nested `TreeGroup` at all — a leaf item (no
   * children) never gets `aria-expanded`, and its `TreeItemTrigger` ignores
   * ArrowRight/ArrowLeft. */
  expandable: boolean;
  expanded: boolean;
  disabled: boolean;
}

const TREE_ITEM_NAME = 'TreeItem';

/**
 * Separate scope from `tree-context.ts`'s root scope — `TreeItemTrigger`/
 * `TreeItemToggle`/`TreeGroup` need per-item state (this item's own
 * `value`/derived `selected`/`expanded`) that has nothing to do with the
 * root's selection/expansion bookkeeping for the *whole* tree, so it's a
 * distinct context (mirrors `accordion-item-context.ts`/
 * `stepper-item-context.ts`).
 */
const [createTreeItemContext, createTreeItemScope] = createContextScope(TREE_ITEM_NAME);
const [TreeItemProvider, useTreeItemContext] =
  createTreeItemContext<TreeItemContextValue>(TREE_ITEM_NAME);

/** Every consumer prop object accepts an optional internal `__scopeTreeItem` prop threaded through by `createTreeItemScope` — not part of the public API. */
type ItemScopedProps<P> = P & { __scopeTreeItem?: Scope<TreeItemContextValue> };

export { TREE_ITEM_NAME, TreeItemProvider, useTreeItemContext, createTreeItemScope };
export type { TreeItemContextValue, ItemScopedProps };
