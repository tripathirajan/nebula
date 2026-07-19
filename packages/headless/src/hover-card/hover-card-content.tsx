import { composeEventHandlers } from '@nebula-lab/primitives/compose-event-handlers';
import { DismissibleLayer } from '@nebula-lab/primitives/dismissible-layer';
import { FocusScope } from '@nebula-lab/primitives/focus-scope';
import { PopperContent } from '@nebula-lab/primitives/popper';
import { Presence } from '@nebula-lab/primitives/presence';
import * as React from 'react';

import { useHoverCardContext, usePopperScope } from './hover-card-context';

import type { ScopedProps } from './hover-card-context';
import type { Align, PopperContentProps, Side } from '@nebula-lab/primitives/popper';

const HOVER_CARD_CONTENT_NAME = 'HoverCardContent';

interface HoverCardContentProps
  extends Pick<
    PopperContentProps,
    'side' | 'sideOffset' | 'align' | 'alignOffset' | 'avoidCollisions' | 'collisionPadding'
  > {
  className?: string;
  children?: React.ReactNode;
  /** Keep mounted while closed instead of unmounting. @default false */
  forceMount?: boolean;
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  onPointerDownOutside?: (event: PointerEvent) => void;
  onPointerEnter?: React.PointerEventHandler<HTMLDivElement>;
  onPointerLeave?: React.PointerEventHandler<HTMLDivElement>;
}

/**
 * `role="dialog"`, non-modal — same `Presence` > `DismissibleLayer` >
 * `FocusScope` (`trapped={false}`) > `PopperContent` collapsing
 * `PopoverContent` uses. Pointer-enter cancels the shared close timer (see
 * `hover-card.tsx`) so moving the mouse from the trigger down into the
 * content doesn't close it mid-transit; pointer-leave re-arms it.
 *
 * Unlike `PopoverContent`, `FocusScope`'s auto-focus is suppressed entirely
 * (both on mount and unmount) — a hover card opens from a hover/focus-intent
 * timer, not a deliberate "open this" action, so it must never steal
 * keyboard focus away from wherever the user actually is (e.g. mid-typing
 * in a form) just because the pointer happened to rest on a trigger. This
 * is the same tradeoff Radix's own `HoverCard` makes; the documented cost is
 * that content reachable only via a portal isn't Tab-reachable in visual
 * order, which is an acceptable limitation for supplementary preview
 * content (same class of tradeoff as `Tooltip`'s content never taking focus
 * at all).
 *
 * @example
 * ```tsx
 * <HoverCardContent>
 *   <p>Jane Doe — Product Designer</p>
 *   <a href="/u/jane">View profile</a>
 * </HoverCardContent>
 * ```
 */
const HoverCardContent = React.forwardRef<HTMLDivElement, ScopedProps<HoverCardContentProps>>(
  (props, forwardedRef) => {
    const {
      __scopeHoverCard,
      forceMount = false,
      onEscapeKeyDown,
      onPointerDownOutside,
      onPointerEnter,
      onPointerLeave,
      side,
      sideOffset,
      align,
      alignOffset,
      avoidCollisions,
      collisionPadding,
      ...contentProps
    } = props;
    const context = useHoverCardContext(HOVER_CARD_CONTENT_NAME, __scopeHoverCard);
    const popperScope = usePopperScope(__scopeHoverCard);

    return (
      <Presence present={forceMount || context.open}>
        <DismissibleLayer
          asChild
          onEscapeKeyDown={onEscapeKeyDown}
          onPointerDownOutside={onPointerDownOutside}
          onDismiss={context.onClose}
        >
          <FocusScope
            asChild
            trapped={false}
            onMountAutoFocus={(event) => event.preventDefault()}
            onUnmountAutoFocus={(event) => event.preventDefault()}
          >
            <PopperContent
              {...popperScope}
              side={side}
              sideOffset={sideOffset}
              align={align}
              alignOffset={alignOffset}
              avoidCollisions={avoidCollisions}
              collisionPadding={collisionPadding}
              role="dialog"
              id={context.contentId}
              data-state={context.open ? 'open' : 'closed'}
              {...contentProps}
              ref={forwardedRef}
              onPointerEnter={composeEventHandlers(onPointerEnter, context.onContentEnter)}
              onPointerLeave={composeEventHandlers(onPointerLeave, context.onContentLeave)}
            />
          </FocusScope>
        </DismissibleLayer>
      </Presence>
    );
  },
);

HoverCardContent.displayName = HOVER_CARD_CONTENT_NAME;

export { HoverCardContent };
export type { HoverCardContentProps, Side, Align };
