
import { composeEventHandlers } from '@nebula-lab/primitives/compose-event-handlers';
import { PopperAnchor } from '@nebula-lab/primitives/popper';
import { Primitive } from '@nebula-lab/primitives/primitive';
import * as React from 'react';


import { useTooltipContext, usePopperScope } from './tooltip-context';

import type { ScopedProps } from './tooltip-context';
import type { PrimitivePropsWithRef } from '@nebula-lab/primitives/primitive';

const TOOLTIP_TRIGGER_NAME = 'TooltipTrigger';

type TooltipTriggerProps = PrimitivePropsWithRef<'button'>;

/**
 * Opens the tooltip (after `delayDuration`) on pointer-enter or focus,
 * closes it immediately on pointer-leave or blur. Uses `onPointerEnter`/
 * `onPointerLeave` rather than `onPointerMove` — the latter would reset the
 * open timer on every pixel of mouse movement inside the trigger instead of
 * firing once on actual entry/exit. Also doubles as `PopperAnchor` (via
 * `asChild`), same as `PopoverTrigger`.
 *
 * @example
 * ```tsx
 * <TooltipTrigger>Hover me</TooltipTrigger>
 * ```
 */
const TooltipTrigger = React.forwardRef<HTMLButtonElement, ScopedProps<TooltipTriggerProps>>(
  (props, forwardedRef) => {
    const {
      __scopeTooltip,
      onPointerEnter,
      onPointerLeave,
      onFocus,
      onBlur,
      onClick,
      ...triggerProps
    } = props;
    const context = useTooltipContext(TOOLTIP_TRIGGER_NAME, __scopeTooltip);
    const popperScope = usePopperScope(__scopeTooltip);

    return (
      <PopperAnchor asChild {...popperScope}>
        <Primitive
          as="button"
          type="button"
          aria-describedby={context.open ? context.contentId : undefined}
          data-state={context.open ? 'open' : 'closed'}
          {...triggerProps}
          ref={forwardedRef}
          onPointerEnter={composeEventHandlers(onPointerEnter, context.onTriggerEnter)}
          onPointerLeave={composeEventHandlers(onPointerLeave, context.onTriggerLeave)}
          onFocus={composeEventHandlers(onFocus, context.onTriggerEnter)}
          onBlur={composeEventHandlers(onBlur, context.onTriggerLeave)}
          onClick={composeEventHandlers(onClick, context.onTriggerClick)}
        />
      </PopperAnchor>
    );
  },
);

TooltipTrigger.displayName = TOOLTIP_TRIGGER_NAME;

export { TooltipTrigger };
export type { TooltipTriggerProps };
