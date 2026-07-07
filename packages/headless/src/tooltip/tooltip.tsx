
import { useControllableState, useId } from '@nebula/hooks';
import { Popper } from '@nebula/primitives/popper';
import * as React from 'react';


import { TooltipProvider, usePopperScope } from './tooltip-context';

import type { ScopedProps } from './tooltip-context';

interface TooltipProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /**
   * Hover/focus delay (ms) before the tooltip opens. Closing is always
   * immediate — unlike `Popover`/`Dialog`, a tooltip should never linger
   * once the pointer leaves. @default 700
   */
  delayDuration?: number;
  children?: React.ReactNode;
}

/**
 * Root of the Tooltip compound component. Built on the same `Popper`
 * anchor-positioning primitive as `Popover`, but with hover/focus open
 * semantics instead of click: `TooltipTrigger` starts a `delayDuration`
 * timer on pointer-enter/focus and opens once it elapses, while
 * pointer-leave/blur cancel the timer and close immediately (see
 * `tooltip-trigger.tsx`).
 *
 * Deliberately simplified vs. Radix: no `TooltipProvider`-level shared
 * "skip delay" group across multiple tooltips (the optimization where
 * hopping from one tooltip's trigger straight to another's skips the delay
 * for a short grace period). Each `Tooltip` instance manages its own delay
 * independently — a reasonable scope cut, not an oversight.
 *
 * @example
 * ```tsx
 * <Tooltip delayDuration={300}>
 *   <TooltipTrigger>Hover me</TooltipTrigger>
 *   <TooltipPortal>
 *     <TooltipContent>Helpful text</TooltipContent>
 *   </TooltipPortal>
 * </Tooltip>
 * ```
 */
function Tooltip(props: ScopedProps<TooltipProps>) {
  const {
    __scopeTooltip,
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    delayDuration = 700,
    children,
  } = props;
  const popperScope = usePopperScope(__scopeTooltip);

  const [open, setOpen] = useControllableState<boolean>({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  });

  const contentId = useId('nebula-tooltip-content');
  const openTimerRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  // Suppresses the tooltip reopening from the focus event a click also
  // produces (e.g. clicking the trigger, then it retains focus) — matches
  // the trigger's own click -> focus ordering, not a debounce concern.
  const wasClickedRef = React.useRef(false);

  const clearOpenTimer = React.useCallback(() => {
    if (openTimerRef.current !== undefined) {
      clearTimeout(openTimerRef.current);
      openTimerRef.current = undefined;
    }
  }, []);

  const onTriggerEnter = React.useCallback(() => {
    clearOpenTimer();
    if (wasClickedRef.current) return;
    openTimerRef.current = setTimeout(() => setOpen(true), delayDuration);
  }, [clearOpenTimer, delayDuration, setOpen]);

  const onTriggerLeave = React.useCallback(() => {
    clearOpenTimer();
    wasClickedRef.current = false;
    setOpen(false);
  }, [clearOpenTimer, setOpen]);

  const onTriggerClick = React.useCallback(() => {
    clearOpenTimer();
    wasClickedRef.current = true;
    setOpen(false);
  }, [clearOpenTimer, setOpen]);

  const onClose = React.useCallback(() => {
    clearOpenTimer();
    setOpen(false);
  }, [clearOpenTimer, setOpen]);

  React.useEffect(() => clearOpenTimer, [clearOpenTimer]);

  return (
    <Popper {...popperScope}>
      <TooltipProvider
        scope={__scopeTooltip}
        open={open}
        contentId={contentId}
        onTriggerEnter={onTriggerEnter}
        onTriggerLeave={onTriggerLeave}
        onTriggerClick={onTriggerClick}
        onClose={onClose}
      >
        {children}
      </TooltipProvider>
    </Popper>
  );
}

export { Tooltip };
export type { TooltipProps };
