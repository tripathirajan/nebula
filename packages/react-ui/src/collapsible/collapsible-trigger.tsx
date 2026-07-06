import { cn } from '@nebula/primitives/cn';
import { CollapsibleTrigger as StylelessCollapsibleTrigger } from '@nebula/styleless/collapsible';
import * as React from 'react';

import type { CollapsibleTriggerProps as StylelessCollapsibleTriggerProps } from '@nebula/styleless/collapsible';

type CollapsibleTriggerProps = StylelessCollapsibleTriggerProps;

const CollapsibleTrigger = React.forwardRef<HTMLButtonElement, CollapsibleTriggerProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <StylelessCollapsibleTrigger
        className={cn(
          'inline-flex items-center gap-1 text-sm font-medium text-[var(--collapsible-text)] outline-none hover:underline focus-visible:ring-2 focus-visible:ring-[var(--collapsible-text)] disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...rest}
        ref={forwardedRef}
      />
    );
  },
);

CollapsibleTrigger.displayName = 'CollapsibleTrigger';

export { CollapsibleTrigger };
export type { CollapsibleTriggerProps };
