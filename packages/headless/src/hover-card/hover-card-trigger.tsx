import { composeEventHandlers } from '@nebula/primitives/compose-event-handlers';
import { PopperAnchor } from '@nebula/primitives/popper';
import { Primitive } from '@nebula/primitives/primitive';
import * as React from 'react';

import { useHoverCardContext, usePopperScope } from './hover-card-context';

import type { ScopedProps } from './hover-card-context';
import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';

const HOVER_CARD_TRIGGER_NAME = 'HoverCardTrigger';

type HoverCardTriggerProps = PrimitivePropsWithRef<'a'>;

/**
 * Renders as an `<a>` by default — the classic hover-card use case is
 * previewing what a link (a username, a linked reference) points to before
 * committing to navigate. Opens on pointer-enter/focus (after `openDelay`),
 * arms the shared close timer on pointer-leave/blur (see `hover-card.tsx`).
 * Also doubles as `PopperAnchor` (via `asChild`), same as `PopoverTrigger`/
 * `TooltipTrigger`.
 *
 * @example
 * ```tsx
 * <HoverCardTrigger href="/u/jane">@jane</HoverCardTrigger>
 * ```
 */
const HoverCardTrigger = React.forwardRef<HTMLAnchorElement, ScopedProps<HoverCardTriggerProps>>(
  (props, forwardedRef) => {
    const {
      __scopeHoverCard,
      onPointerEnter,
      onPointerLeave,
      onFocus,
      onBlur,
      ...triggerProps
    } = props;
    const context = useHoverCardContext(HOVER_CARD_TRIGGER_NAME, __scopeHoverCard);
    const popperScope = usePopperScope(__scopeHoverCard);

    return (
      <PopperAnchor asChild {...popperScope}>
        <Primitive
          as="a"
          aria-describedby={context.open ? context.contentId : undefined}
          data-state={context.open ? 'open' : 'closed'}
          {...triggerProps}
          ref={forwardedRef}
          onPointerEnter={composeEventHandlers(onPointerEnter, context.onTriggerEnter)}
          onPointerLeave={composeEventHandlers(onPointerLeave, context.onTriggerLeave)}
          onFocus={composeEventHandlers(onFocus, context.onTriggerEnter)}
          onBlur={composeEventHandlers(onBlur, context.onTriggerLeave)}
        />
      </PopperAnchor>
    );
  },
);

HoverCardTrigger.displayName = HOVER_CARD_TRIGGER_NAME;

export { HoverCardTrigger };
export type { HoverCardTriggerProps };
