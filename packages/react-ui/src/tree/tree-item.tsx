import { TreeItem as HeadlessTreeItem } from '@nebula-lab/headless/tree';
import { cn } from '@nebula-lab/primitives/cn';
import * as React from 'react';

import type { TreeItemProps as HeadlessTreeItemProps } from '@nebula-lab/headless/tree';

type TreeItemProps = HeadlessTreeItemProps;

/**
 * One row — hover/selected fills read `--tree-hover-bg`/`--tree-selected-bg`
 * (+ `-selected-text`) from `../tokens/component.ts`. `flex` + `gap` so a
 * `TreeItemToggle` chevron and the row's label/icon line up on one line;
 * indentation for nested depth is left to the consumer's own `TreeGroup`
 * padding (see `TreeGroup`'s `pl-4`) rather than computed here, since this
 * component has no notion of its own depth.
 */
const TreeItem = React.forwardRef<HTMLLIElement, TreeItemProps>((props, forwardedRef) => {
  const { className, ...rest } = props;
  return (
    <HeadlessTreeItem
      className={cn(
        'flex cursor-pointer items-center gap-1 rounded-[var(--radius-selector)] px-2 py-1 outline-none hover:bg-[var(--tree-hover-bg)] focus-visible:ring-2 focus-visible:ring-[var(--tree-selected-bg)] data-[state=selected]:bg-[var(--tree-selected-bg)] data-[state=selected]:text-[var(--tree-selected-text)] data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
        className,
      )}
      {...rest}
      ref={forwardedRef}
    />
  );
});

TreeItem.displayName = 'TreeItem';

export { TreeItem };
export type { TreeItemProps };
