import { CollapsibleTrigger as HeadlessCollapsibleTrigger } from '@nebula-lab/headless/collapsible';
import { cn } from '@nebula-lab/primitives/cn';
import * as React from 'react';

import type { CollapsibleTriggerProps as HeadlessCollapsibleTriggerProps } from '@nebula-lab/headless/collapsible';

type CollapsibleTriggerProps = HeadlessCollapsibleTriggerProps;

const CollapsibleTrigger = React.forwardRef<HTMLButtonElement, CollapsibleTriggerProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <HeadlessCollapsibleTrigger
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
