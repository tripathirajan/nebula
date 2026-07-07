
import { PopperContent } from '@nebula/primitives/popper';
import { Presence } from '@nebula/primitives/presence';
import * as React from 'react';


import { useTooltipContext, usePopperScope } from './tooltip-context';

import type { ScopedProps } from './tooltip-context';
import type { Align, PopperContentProps, Side } from '@nebula/primitives/popper';

const TOOLTIP_CONTENT_NAME = 'TooltipContent';

interface TooltipContentProps
  extends Pick<
    PopperContentProps,
    'side' | 'sideOffset' | 'align' | 'alignOffset' | 'avoidCollisions' | 'collisionPadding'
  > {
  className?: string;
  children?: React.ReactNode;
  /** Keep mounted while closed instead of unmounting. @default false */
  forceMount?: boolean;
}

/**
 * `role="tooltip"`, positioned against `TooltipTrigger`'s anchor via
 * `@nebula/primitives`' `PopperContent`. Unlike `PopoverContent`/
 * `DialogContent`, deliberately NOT wrapped in `DismissibleLayer` or
 * `FocusScope` — a tooltip is purely informational: it never receives
 * focus, never traps Tab, and isn't dismissed by an outside click (there's
 * nothing "outside" to click while just hovering). The one dismissal it
 * does need — Escape — is wired directly via a `keydown` listener rather
 * than pulling in the outside-click machinery `DismissibleLayer` also
 * provides, since only the Escape half of that primitive applies here.
 *
 * @example
 * ```tsx
 * <TooltipContent side="top" sideOffset={4}>
 *   Helpful text
 * </TooltipContent>
 * ```
 */
const TooltipContent = React.forwardRef<HTMLDivElement, ScopedProps<TooltipContentProps>>(
  (props, forwardedRef) => {
    const {
      __scopeTooltip,
      forceMount = false,
      side,
      sideOffset,
      align,
      alignOffset,
      avoidCollisions,
      collisionPadding,
      ...contentProps
    } = props;
    const context = useTooltipContext(TOOLTIP_CONTENT_NAME, __scopeTooltip);
    const popperScope = usePopperScope(__scopeTooltip);

    React.useEffect(() => {
      if (!context.open) return;
      function onKeyDown(event: KeyboardEvent) {
        if (event.key === 'Escape') context.onClose();
      }
      document.addEventListener('keydown', onKeyDown);
      return () => document.removeEventListener('keydown', onKeyDown);
    }, [context]);

    return (
      <Presence present={forceMount || context.open}>
        <PopperContent
          {...popperScope}
          side={side}
          sideOffset={sideOffset}
          align={align}
          alignOffset={alignOffset}
          avoidCollisions={avoidCollisions}
          collisionPadding={collisionPadding}
          role="tooltip"
          id={context.contentId}
          data-state={context.open ? 'open' : 'closed'}
          {...contentProps}
          ref={forwardedRef}
        />
      </Presence>
    );
  },
);

TooltipContent.displayName = TOOLTIP_CONTENT_NAME;

export { TooltipContent };
export type { TooltipContentProps, Side, Align };
