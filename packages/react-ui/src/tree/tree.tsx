import { Tree as HeadlessTree } from '@nebula-lab/headless/tree';
import { cn } from '@nebula-lab/primitives/cn';
import * as React from 'react';

import type { TreeProps as HeadlessTreeProps } from '@nebula-lab/headless/tree';

type TreeProps = HeadlessTreeProps;

/** Root `role="tree"` list — sets the base text size/color every nested `TreeItem` inherits. */
const Tree = React.forwardRef<HTMLUListElement, TreeProps>((props, forwardedRef) => {
  const { className, ...rest } = props;
  return (
    <HeadlessTree
      className={cn('text-sm text-[var(--tree-text)]', className)}
      {...rest}
      ref={forwardedRef}
    />
  );
});

Tree.displayName = 'Tree';

export { Tree };
export type { TreeProps };
export type { TreeSingleProps, TreeMultipleProps } from '@nebula-lab/headless/tree';
