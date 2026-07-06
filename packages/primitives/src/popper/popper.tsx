import * as React from 'react';

import { PopperProvider } from './popper-context';

import type { ScopedProps } from './popper-context';

interface PopperProps {
  children?: React.ReactNode;
}

/**
 * Root of the Popper compound primitive — the shared anchor-positioning
 * building block `Popover` and `Tooltip` (once built) are both meant to be
 * built on, the same way Radix's `Popover`/`Tooltip`/`DropdownMenu` all
 * share one `Popper` primitive rather than each reimplementing collision
 * detection. Renders no DOM of its own, just holds the anchor element
 * `PopperAnchor` registers so `PopperContent` can measure and position
 * against it.
 *
 * @example
 * ```tsx
 * <Popper>
 *   <PopperAnchor asChild><button>Open</button></PopperAnchor>
 *   <PopperContent side="bottom" align="center" sideOffset={4}>
 *     {content}
 *   </PopperContent>
 * </Popper>
 * ```
 */
function Popper(props: ScopedProps<PopperProps>) {
  const { __scopePopper, children } = props;
  const [anchor, setAnchor] = React.useState<HTMLElement | null>(null);

  return (
    <PopperProvider scope={__scopePopper} anchor={anchor} onAnchorChange={setAnchor}>
      {children}
    </PopperProvider>
  );
}

export { Popper };
export type { PopperProps };
