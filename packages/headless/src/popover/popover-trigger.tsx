
import { composeEventHandlers } from '@nebula-lab/primitives/compose-event-handlers';
import { PopperAnchor } from '@nebula-lab/primitives/popper';
import { Primitive } from '@nebula-lab/primitives/primitive';
import * as React from 'react';


import { usePopoverContext, usePopperScope } from './popover-context';

import type { ScopedProps } from './popover-context';
import type { PrimitivePropsWithRef } from '@nebula-lab/primitives/primitive';

const POPOVER_TRIGGER_NAME = 'PopoverTrigger';

type PopoverTriggerProps = PrimitivePropsWithRef<'button'>;

/**
 * Toggles the popover open/closed on click (unlike `DialogTrigger`, which
 * only opens — a popover trigger commonly doubles as its own close button).
 * Also doubles as `PopperAnchor` (via `asChild`), registering itself as the
 * element `PopoverContent` positions against — no separate anchor element
 * needed for the common case of "anchor to the trigger itself".
 *
 * @example
 * ```tsx
 * <PopoverTrigger>Filters</PopoverTrigger>
 * ```
 */
const PopoverTrigger = React.forwardRef<HTMLButtonElement, ScopedProps<PopoverTriggerProps>>(
  (props, forwardedRef) => {
    const { __scopePopover, onClick, ...triggerProps } = props;
    const context = usePopoverContext(POPOVER_TRIGGER_NAME, __scopePopover);
    const popperScope = usePopperScope(__scopePopover);

    return (
      <PopperAnchor asChild {...popperScope}>
        <Primitive
          as="button"
          type="button"
          aria-haspopup="dialog"
          aria-expanded={context.open}
          aria-controls={context.open ? context.contentId : undefined}
          data-state={context.open ? 'open' : 'closed'}
          {...triggerProps}
          ref={forwardedRef}
          onClick={composeEventHandlers(onClick, () => context.onOpenChange(!context.open))}
        />
      </PopperAnchor>
    );
  },
);

PopoverTrigger.displayName = POPOVER_TRIGGER_NAME;

export { PopoverTrigger };
export type { PopoverTriggerProps };
