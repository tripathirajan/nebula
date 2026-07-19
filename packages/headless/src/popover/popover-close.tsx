
import { composeEventHandlers } from '@nebula-lab/primitives/compose-event-handlers';
import { Primitive } from '@nebula-lab/primitives/primitive';
import * as React from 'react';


import { usePopoverContext } from './popover-context';

import type { ScopedProps } from './popover-context';
import type { PrimitivePropsWithRef } from '@nebula-lab/primitives/primitive';

const POPOVER_CLOSE_NAME = 'PopoverClose';

type PopoverCloseProps = PrimitivePropsWithRef<'button'>;

/**
 * Closes the popover on click. Same shape as `DialogClose` — give it an
 * accessible label (visible text, or `aria-label` for an icon button).
 *
 * @example
 * ```tsx
 * <PopoverClose aria-label="Close">×</PopoverClose>
 * ```
 */
const PopoverClose = React.forwardRef<HTMLButtonElement, ScopedProps<PopoverCloseProps>>(
  (props, forwardedRef) => {
    const { __scopePopover, onClick, ...closeProps } = props;
    const context = usePopoverContext(POPOVER_CLOSE_NAME, __scopePopover);

    return (
      <Primitive
        as="button"
        type="button"
        {...closeProps}
        ref={forwardedRef}
        onClick={composeEventHandlers(onClick, () => context.onOpenChange(false))}
      />
    );
  },
);

PopoverClose.displayName = POPOVER_CLOSE_NAME;

export { PopoverClose };
export type { PopoverCloseProps };
