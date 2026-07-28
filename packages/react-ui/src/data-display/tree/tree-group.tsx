import { TreeGroup as HeadlessTreeGroup } from '@nebula-lab/headless/tree';
import { cn } from '@nebula-lab/primitives/cn';
import * as React from 'react';

import type { TreeGroupProps as HeadlessTreeGroupProps } from '@nebula-lab/headless/tree';

type TreeGroupProps = HeadlessTreeGroupProps;

/** Nested `<ul>` for one item's children — indented so depth is visible; each further-nested `TreeGroup` compounds the same `pl-4`, same convention as `AccordionContent`'s single fixed padding rather than a depth-aware calculation. */
const TreeGroup = React.forwardRef<HTMLUListElement, TreeGroupProps>((props, forwardedRef) => {
  const { className, ...rest } = props;
  return (
    <HeadlessTreeGroup className={cn('pl-4', className)} {...rest} ref={forwardedRef} />
  );
});

TreeGroup.displayName = 'TreeGroup';

export { TreeGroup };
export type { TreeGroupProps };
