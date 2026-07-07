import { CollapsibleContent as HeadlessCollapsibleContent } from '@nebula/headless/collapsible';
import { cn } from '@nebula/primitives/cn';
import * as React from 'react';

import type { CollapsibleContentProps as HeadlessCollapsibleContentProps } from '@nebula/headless/collapsible';

type CollapsibleContentProps = HeadlessCollapsibleContentProps;

/** No animation built in — pass `className` with `data-[state=open]:animate-in`/`data-[state=closed]:animate-out` (or a plain CSS transition) to animate expand/collapse, per the headless source's own doc comment. */
const CollapsibleContent = React.forwardRef<HTMLDivElement, CollapsibleContentProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <HeadlessCollapsibleContent
        className={cn('text-sm text-[var(--collapsible-text)]', className)}
        {...rest}
        ref={forwardedRef}
      />
    );
  },
);

CollapsibleContent.displayName = 'CollapsibleContent';

export { CollapsibleContent };
export type { CollapsibleContentProps };
