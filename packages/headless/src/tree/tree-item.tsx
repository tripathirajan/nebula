import { composeEventHandlers } from '@nebula-lab/primitives/compose-event-handlers';
import { Primitive } from '@nebula-lab/primitives/primitive';
import * as React from 'react';

import { useTreeContext } from './tree-context';
import { TreeItemProvider } from './tree-item-context';

import type { ScopedProps } from './tree-context';
import type { ItemScopedProps } from './tree-item-context';
import type { PrimitivePropsWithRef } from '@nebula-lab/primitives/primitive';

const TREE_ITEM_NAME = 'TreeItem';

interface TreeItemProps extends PrimitivePropsWithRef<'li'> {
  /** Identifies this item within its `Tree` — must be unique within the whole tree. */
  value: string;
  /** Whether this item can hold a nested `TreeGroup` at all. Leaf items
   * (files, not folders) should omit this — they never get `aria-expanded`,
   * and ArrowRight/ArrowLeft do nothing on them, per the Tree View pattern. */
  expandable?: boolean;
  disabled?: boolean;
}

/**
 * `role="treeitem"` — and, per the WAI-ARIA Tree View pattern, the element
 * that's actually focusable and clickable itself (not a nested button; a
 * tree row's whole line is the interactive unit). Roving-tabindex is
 * computed by comparing this item's `value` against the root's
 * `activeValue` (see `tree-context.ts`) rather than via
 * `@nebula-lab/primitives`' `RovingFocusGroup`, since Tree's nested structure
 * needs `Tree`'s own custom arrow-key handling (see `tree.tsx`) — this
 * component only needs to expose the resulting `tabIndex`, register itself
 * so the root can default `activeValue` to the first item, track focus,
 * and select on click/Enter/Space.
 *
 * @example
 * ```tsx
 * <TreeItem value="src" expandable>
 *   src
 *   <TreeItemToggle aria-label="Toggle expanded">▸</TreeItemToggle>
 *   <TreeGroup>...</TreeGroup>
 * </TreeItem>
 * ```
 */
const TreeItem = React.forwardRef<HTMLLIElement, ScopedProps<ItemScopedProps<TreeItemProps>>>(
  (props, forwardedRef) => {
    const {
      __scopeTree,
      __scopeTreeItem,
      value,
      expandable = false,
      disabled: disabledProp = false,
      onClick,
      onFocus,
      onKeyDown,
      ...itemProps
    } = props;

    const rootContext = useTreeContext(TREE_ITEM_NAME, __scopeTree);
    const selected = rootContext.isItemSelected(value);
    const expanded = expandable && rootContext.isItemExpanded(value);
    const disabled = disabledProp || rootContext.disabled;

    React.useEffect(() => {
      rootContext.registerItem(value);
      // Only ever needs to run once per mount — `registerItem` only takes
      // effect the first time any item calls it (see `tree.tsx`).
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    const select = () => {
      if (disabled) return;
      rootContext.onItemSelectedChange(value, !selected);
    };

    return (
      <TreeItemProvider
        scope={__scopeTreeItem}
        value={value}
        selected={selected}
        expandable={expandable}
        expanded={expanded}
        disabled={disabled}
      >
        <Primitive
          as="li"
          role="treeitem"
          aria-selected={selected}
          aria-expanded={expandable ? expanded : undefined}
          aria-disabled={disabled || undefined}
          data-state={selected ? 'selected' : 'unselected'}
          data-disabled={disabled ? '' : undefined}
          data-value={value}
          tabIndex={disabled ? undefined : rootContext.activeValue === value ? 0 : -1}
          {...itemProps}
          ref={forwardedRef}
          onClick={composeEventHandlers(onClick, (event) => {
            // A click on a nested item's row bubbles up through every
            // ancestor `TreeItem`'s own `<li>` (real DOM nesting — a
            // `TreeGroup` renders inside its parent `TreeItem`), so without
            // this every ancestor's `onClick` fires too, each re-selecting
            // itself last and clobbering the click's actual target.
            event.stopPropagation();
            select();
          })}
          onFocus={composeEventHandlers(onFocus, () => rootContext.setActiveValue(value))}
          onKeyDown={composeEventHandlers(onKeyDown, (event) => {
            if (event.key === ' ' || event.key === 'Enter') {
              event.preventDefault();
              select();
            }
          })}
        />
      </TreeItemProvider>
    );
  },
);

TreeItem.displayName = TREE_ITEM_NAME;

export { TreeItem };
export type { TreeItemProps };
