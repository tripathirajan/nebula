
import { useControllableState, useId } from '@nebula/hooks';
import { Popper } from '@nebula/primitives/popper';
import * as React from 'react';


import { PopoverProvider, usePopperScope } from './popover-context';

import type { ScopedProps } from './popover-context';

interface PopoverProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

/**
 * Root of the Popover compound component. Unlike `Dialog`, non-modal:
 * `PopoverContent` doesn't trap Tab and doesn't mark the rest of the page
 * inert — it's an anchored, dismissible surface, not a page-blocking one.
 * Wraps children in `@nebula/primitives`' `Popper` (via `usePopperScope`, so
 * `__scopePopover` threads through to `Popper`'s own scope too) for the
 * anchor-positioning `PopoverTrigger`/`PopoverContent` are built on. Renders
 * no DOM of its own, same as `Dialog`.
 *
 * @example
 * ```tsx
 * <Popover>
 *   <PopoverTrigger>Filters</PopoverTrigger>
 *   <PopoverPortal>
 *     <PopoverContent side="bottom" align="start">
 *       {filters}
 *       <PopoverClose>Done</PopoverClose>
 *     </PopoverContent>
 *   </PopoverPortal>
 * </Popover>
 * ```
 */
function Popover(props: ScopedProps<PopoverProps>) {
  const { __scopePopover, open: openProp, defaultOpen = false, onOpenChange, children } = props;
  const popperScope = usePopperScope(__scopePopover);

  const [open, setOpen] = useControllableState<boolean>({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  });

  const contentId = useId('nebula-popover-content');

  return (
    <Popper {...popperScope}>
      <PopoverProvider scope={__scopePopover} open={open} onOpenChange={setOpen} contentId={contentId}>
        {children}
      </PopoverProvider>
    </Popper>
  );
}

export { Popover };
export type { PopoverProps };
