import { cn } from '@nebula/primitives/cn';
import { TreeGroup as StylelessTreeGroup } from '@nebula/styleless/tree';
import * as React from 'react';

import type { TreeGroupProps as StylelessTreeGroupProps } from '@nebula/styleless/tree';

type TreeGroupProps = StylelessTreeGroupProps;

/** Nested `<ul>` for one item's children — indented so depth is visible; each further-nested `TreeGroup` compounds the same `pl-4`, same convention as `AccordionContent`'s single fixed padding rather than a depth-aware calculation. */
const TreeGroup = React.forwardRef<HTMLUListElement, TreeGroupProps>((props, forwardedRef) => {
  const { className, ...rest } = props;
  return (
    <StylelessTreeGroup className={cn('pl-4', className)} {...rest} ref={forwardedRef} />
  );
});

TreeGroup.displayName = 'TreeGroup';

export { TreeGroup };
export type { TreeGroupProps };
