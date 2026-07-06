import { cn } from '@nebula/primitives/cn';
import { CollapsibleContent as StylelessCollapsibleContent } from '@nebula/styleless/collapsible';
import * as React from 'react';

import type { CollapsibleContentProps as StylelessCollapsibleContentProps } from '@nebula/styleless/collapsible';

type CollapsibleContentProps = StylelessCollapsibleContentProps;

/** No animation built in — pass `className` with `data-[state=open]:animate-in`/`data-[state=closed]:animate-out` (or a plain CSS transition) to animate expand/collapse, per the styleless source's own doc comment. */
const CollapsibleContent = React.forwardRef<HTMLDivElement, CollapsibleContentProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <StylelessCollapsibleContent
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
