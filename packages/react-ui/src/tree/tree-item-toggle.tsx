import { TreeItemToggle as HeadlessTreeItemToggle } from '@nebula/headless/tree';
import { cn } from '@nebula/primitives/cn';
import * as React from 'react';

import type { TreeItemToggleProps as HeadlessTreeItemToggleProps } from '@nebula/headless/tree';

type TreeItemToggleProps = HeadlessTreeItemToggleProps;

/** Small chevron button — rotates 90° when `data-state="expanded"` so a single `▸` glyph doubles as both states without a separate icon swap. */
const TreeItemToggle = React.forwardRef<HTMLButtonElement, TreeItemToggleProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <HeadlessTreeItemToggle
        className={cn(
          'flex h-4 w-4 shrink-0 items-center justify-center text-[var(--tree-text)]/60 transition-transform data-[state=expanded]:rotate-90',
          className,
        )}
        {...rest}
        ref={forwardedRef}
      />
    );
  },
);

TreeItemToggle.displayName = 'TreeItemToggle';

export { TreeItemToggle };
export type { TreeItemToggleProps };
