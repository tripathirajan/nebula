import { useControllableState, useId } from '@nebula/hooks';
import { Popper } from '@nebula/primitives/popper';
import * as React from 'react';

import { HoverCardProvider, usePopperScope } from './hover-card-context';

import type { ScopedProps } from './hover-card-context';

interface HoverCardProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Hover/focus delay (ms) before opening. @default 700 */
  openDelay?: number;
  /** Delay (ms) before closing once the pointer leaves *both* the trigger and the content — unlike `Tooltip`, closing isn't instant, since the whole point of a hover card is being able to move the mouse into it (to click a link, etc). @default 300 */
  closeDelay?: number;
  children?: React.ReactNode;
}

/**
 * Root of the HoverCard compound component. Built on the same `Popper`
 * anchor-positioning primitive as `Popover`/`Tooltip`, and opens on hover
 * like `Tooltip` (after `openDelay`) — but unlike `Tooltip`, closing is
 * *not* instant on pointer-leave: `HoverCardContent` typically holds real
 * interactive content (a profile card's follow button, a link preview's
 * "visit site" link), so the pointer needs a `closeDelay` grace period to
 * actually travel from the trigger down into the content without it
 * vanishing mid-transit — both `HoverCardTrigger` and `HoverCardContent`
 * arm/disarm the same shared close timer, the technique
 * `NavigationMenuTrigger`/`NavigationMenuContent` share.
 *
 * @example
 * ```tsx
 * <HoverCard>
 *   <HoverCardTrigger href="/u/jane">@jane</HoverCardTrigger>
 *   <HoverCardPortal>
 *     <HoverCardContent>Jane Doe — Product Designer</HoverCardContent>
 *   </HoverCardPortal>
 * </HoverCard>
 * ```
 */
function HoverCard(props: ScopedProps<HoverCardProps>) {
  const {
    __scopeHoverCard,
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    openDelay = 700,
    closeDelay = 300,
    children,
  } = props;
  const popperScope = usePopperScope(__scopeHoverCard);

  const [open, setOpen] = useControllableState<boolean>({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  });

  const contentId = useId('nebula-hover-card-content');
  const openTimerRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const closeTimerRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const cancelOpenTimer = React.useCallback(() => {
    if (openTimerRef.current !== undefined) {
      clearTimeout(openTimerRef.current);
      openTimerRef.current = undefined;
    }
  }, []);

  const cancelCloseTimer = React.useCallback(() => {
    if (closeTimerRef.current !== undefined) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = undefined;
    }
  }, []);

  const armCloseTimer = React.useCallback(() => {
    cancelCloseTimer();
    closeTimerRef.current = setTimeout(() => setOpen(false), closeDelay);
  }, [cancelCloseTimer, closeDelay, setOpen]);

  const onTriggerEnter = React.useCallback(() => {
    cancelCloseTimer();
    cancelOpenTimer();
    openTimerRef.current = setTimeout(() => setOpen(true), openDelay);
  }, [cancelCloseTimer, cancelOpenTimer, openDelay, setOpen]);

  const onTriggerLeave = React.useCallback(() => {
    cancelOpenTimer();
    armCloseTimer();
  }, [cancelOpenTimer, armCloseTimer]);

  const onClose = React.useCallback(() => {
    cancelOpenTimer();
    cancelCloseTimer();
    setOpen(false);
  }, [cancelOpenTimer, cancelCloseTimer, setOpen]);

  React.useEffect(
    () => () => {
      cancelOpenTimer();
      cancelCloseTimer();
    },
    [cancelOpenTimer, cancelCloseTimer],
  );

  return (
    <Popper {...popperScope}>
      <HoverCardProvider
        scope={__scopeHoverCard}
        open={open}
        contentId={contentId}
        onTriggerEnter={onTriggerEnter}
        onTriggerLeave={onTriggerLeave}
        onContentEnter={cancelCloseTimer}
        onContentLeave={armCloseTimer}
        onClose={onClose}
      >
        {children}
      </HoverCardProvider>
    </Popper>
  );
}

export { HoverCard };
export type { HoverCardProps };
