
import { useControllableState, useId } from '@nebula-lab/hooks';
import { Primitive } from '@nebula-lab/primitives/primitive';
import * as React from 'react';


import { CollapsibleProvider } from './collapsible-context';

import type { ScopedProps } from './collapsible-context';
import type { PrimitivePropsWithRef } from '@nebula-lab/primitives/primitive';

interface CollapsibleProps extends PrimitivePropsWithRef<'div'> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
}

/**
 * Root of the Collapsible compound component — a single expand/collapse
 * panel, independent of any group semantics (unlike `Accordion`, which is
 * effectively several of these sharing an "at most one/many open" rule via
 * its own root). This is the standalone primitive `accordion-context.ts`'s
 * header comment flags `Accordion` as a candidate to eventually migrate onto
 * — that migration isn't done here (it's a separate, orthogonal change with
 * its own risk), this just makes the primitive available for direct use
 * (a "show more" panel, a filter section, anything that expands/collapses
 * without being part of a same-root group).
 *
 * @example
 * ```tsx
 * <Collapsible defaultOpen>
 *   <CollapsibleTrigger>Show more</CollapsibleTrigger>
 *   <CollapsibleContent>Extra detail.</CollapsibleContent>
 * </Collapsible>
 * ```
 */
const Collapsible = React.forwardRef<HTMLDivElement, ScopedProps<CollapsibleProps>>(
  (props, forwardedRef) => {
    const {
      __scopeCollapsible,
      open: openProp,
      defaultOpen = false,
      onOpenChange,
      disabled = false,
      ...collapsibleProps
    } = props;

    const [open, setOpen] = useControllableState<boolean>({
      prop: openProp,
      defaultProp: defaultOpen,
      onChange: onOpenChange,
    });

    const contentId = useId('nebula-collapsible-content');

    return (
      <CollapsibleProvider
        scope={__scopeCollapsible}
        open={open}
        disabled={disabled}
        onOpenToggle={() => setOpen((current) => !current)}
        contentId={contentId}
      >
        <Primitive
          as="div"
          data-state={open ? 'open' : 'closed'}
          data-disabled={disabled ? '' : undefined}
          {...collapsibleProps}
          ref={forwardedRef}
        />
      </CollapsibleProvider>
    );
  },
);

Collapsible.displayName = 'Collapsible';

export { Collapsible };
export type { CollapsibleProps };
