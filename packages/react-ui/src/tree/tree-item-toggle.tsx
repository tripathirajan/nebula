import { cn } from '@nebula/primitives/cn';
import { TreeItemToggle as StylelessTreeItemToggle } from '@nebula/styleless/tree';
import * as React from 'react';

import type { TreeItemToggleProps as StylelessTreeItemToggleProps } from '@nebula/styleless/tree';

type TreeItemToggleProps = StylelessTreeItemToggleProps;

/** Small chevron button — rotates 90° when `data-state="expanded"` so a single `▸` glyph doubles as both states without a separate icon swap. */
const TreeItemToggle = React.forwardRef<HTMLButtonElement, TreeItemToggleProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <StylelessTreeItemToggle
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
