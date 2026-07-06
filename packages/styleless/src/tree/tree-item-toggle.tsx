import { Primitive } from '@nebula/primitives/primitive';
import * as React from 'react';

import { useTreeContext } from './tree-context';
import { useTreeItemContext } from './tree-item-context';

import type { ScopedProps } from './tree-context';
import type { ItemScopedProps } from './tree-item-context';
import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';

const TREE_ITEM_TOGGLE_NAME = 'TreeItemToggle';

type TreeItemToggleProps = PrimitivePropsWithRef<'button'>;

/**
 * Expand/collapse icon button for one `TreeItem`, e.g. a chevron. Stops
 * propagation on click so it doesn't also trigger `TreeItem`'s own
 * click-to-select handler — toggling a folder open and selecting it are
 * different actions. `tabIndex={-1}`: ArrowRight/ArrowLeft on the focused
 * `TreeItem` already expand/collapse it (see `tree.tsx`), so this button is
 * a redundant-but-present mouse/touch affordance, not the only way to reach
 * this functionality from a keyboard — same treatment
 * `NumberInputIncrement`/`NumberInputDecrement` get for the equivalent
 * native `<input type="number">` behavior. Not `aria-hidden` (that would
 * also remove it from a screen reader's virtual cursor); always pass an
 * `aria-label` since there's rarely visible text on a plain chevron.
 *
 * @example
 * ```tsx
 * <TreeItemToggle aria-label="Toggle expanded">{expanded ? '▾' : '▸'}</TreeItemToggle>
 * ```
 */
const TreeItemToggle = React.forwardRef<
  HTMLButtonElement,
  ScopedProps<ItemScopedProps<TreeItemToggleProps>>
>((props, forwardedRef) => {
  const { __scopeTree, __scopeTreeItem, onClick, ...toggleProps } = props;
  const rootContext = useTreeContext(TREE_ITEM_TOGGLE_NAME, __scopeTree);
  const itemContext = useTreeItemContext(TREE_ITEM_TOGGLE_NAME, __scopeTreeItem);

  if (!itemContext.expandable) return null;

  return (
    <Primitive
      as="button"
      type="button"
      tabIndex={-1}
      data-state={itemContext.expanded ? 'expanded' : 'collapsed'}
      disabled={itemContext.disabled}
      {...toggleProps}
      ref={forwardedRef}
      onClick={(event) => {
        event.stopPropagation();
        onClick?.(event);
        if (itemContext.disabled) return;
        rootContext.onItemExpandedChange(itemContext.value, !itemContext.expanded);
      }}
    />
  );
});

TreeItemToggle.displayName = TREE_ITEM_TOGGLE_NAME;

export { TreeItemToggle };
export type { TreeItemToggleProps };
