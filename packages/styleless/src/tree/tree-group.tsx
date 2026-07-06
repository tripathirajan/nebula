import { Presence } from '@nebula/primitives/presence';
import { Primitive } from '@nebula/primitives/primitive';
import * as React from 'react';

import { useTreeItemContext } from './tree-item-context';

import type { ItemScopedProps } from './tree-item-context';
import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';

const TREE_GROUP_NAME = 'TreeGroup';

interface TreeGroupProps extends PrimitivePropsWithRef<'ul'> {
  /** Keep the group mounted (but `hidden`) while collapsed instead of
   * unmounting it — same escape hatch as `AccordionContent`'s `forceMount`.
   * Leave this `false` (the default) for large trees: unmounting collapsed
   * subtrees is what keeps `Tree`'s arrow-key navigation correct (a plain
   * `[role="treeitem"]` DOM query only finds items that are actually
   * reachable — see `tree.tsx`), and keeps huge trees cheap to render.
   * @default false
   */
  forceMount?: boolean;
}

/**
 * `role="group"` — the nested `<ul>` holding one `TreeItem`'s children.
 * Wrapped in `@nebula/primitives`' `Presence` so collapse/expand can be
 * animated like `AccordionContent`, but defaults to fully unmounting (not
 * just `hidden`) while collapsed, unlike `AccordionContent` — see
 * `forceMount`.
 *
 * @example
 * ```tsx
 * <TreeItem value="src" expandable>
 *   src
 *   <TreeGroup>
 *     <TreeItem value="src/index.ts">index.ts</TreeItem>
 *   </TreeGroup>
 * </TreeItem>
 * ```
 */
const TreeGroup = React.forwardRef<HTMLUListElement, ItemScopedProps<TreeGroupProps>>(
  (props, forwardedRef) => {
    const { __scopeTreeItem, forceMount = false, ...groupProps } = props;
    const itemContext = useTreeItemContext(TREE_GROUP_NAME, __scopeTreeItem);

    return (
      <Presence present={forceMount || itemContext.expanded}>
        <Primitive
          as="ul"
          role="group"
          data-state={itemContext.expanded ? 'expanded' : 'collapsed'}
          hidden={!itemContext.expanded}
          {...groupProps}
          ref={forwardedRef}
        />
      </Presence>
    );
  },
);

TreeGroup.displayName = TREE_GROUP_NAME;

export { TreeGroup };
export type { TreeGroupProps };
