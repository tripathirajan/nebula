import { cn } from '@nebula/primitives/cn';
import { Tree as StylelessTree } from '@nebula/styleless/tree';
import * as React from 'react';

import type { TreeProps as StylelessTreeProps } from '@nebula/styleless/tree';

type TreeProps = StylelessTreeProps;

/** Root `role="tree"` list — sets the base text size/color every nested `TreeItem` inherits. */
const Tree = React.forwardRef<HTMLUListElement, TreeProps>((props, forwardedRef) => {
  const { className, ...rest } = props;
  return (
    <StylelessTree
      className={cn('text-sm text-[var(--tree-text)]', className)}
      {...rest}
      ref={forwardedRef}
    />
  );
});

Tree.displayName = 'Tree';

export { Tree };
export type { TreeProps };
export type { TreeSingleProps, TreeMultipleProps } from '@nebula/styleless/tree';
