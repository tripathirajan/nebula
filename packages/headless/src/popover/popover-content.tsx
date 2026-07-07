
import { DismissibleLayer } from '@nebula/primitives/dismissible-layer';
import { FocusScope } from '@nebula/primitives/focus-scope';
import { PopperContent } from '@nebula/primitives/popper';
import { Presence } from '@nebula/primitives/presence';
import * as React from 'react';


import { usePopoverContext, usePopperScope } from './popover-context';

import type { ScopedProps } from './popover-context';
import type { Align, PopperContentProps, Side } from '@nebula/primitives/popper';

const POPOVER_CONTENT_NAME = 'PopoverContent';

interface PopoverContentProps
  extends Pick<
    PopperContentProps,
    'side' | 'sideOffset' | 'align' | 'alignOffset' | 'avoidCollisions' | 'collisionPadding'
  > {
  className?: string;
  children?: React.ReactNode;
  /** Keep mounted while closed instead of unmounting. @default false */
  forceMount?: boolean;
  /** Forwarded to `DismissibleLayer`. Call `event.preventDefault()` to stop Escape from closing the popover. */
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  /** Forwarded to `DismissibleLayer`. Call `event.preventDefault()` to stop an outside click from closing the popover. */
  onPointerDownOutside?: (event: PointerEvent) => void;
}

/**
 * `role="dialog"` (no `aria-modal` — this is the non-modal counterpart to
 * `DialogContent`), positioned against `PopoverTrigger`'s anchor via
 * `@nebula/primitives`' `PopperContent`. Same `asChild`-chaining trick as
 * `DialogContent` (`Presence` > `DismissibleLayer` > `FocusScope` >
 * `PopperContent`) collapses all of that behavior onto one real DOM node.
 * `trapped={false}` on `FocusScope` is the key difference from `Dialog`:
 * focus still moves in on open and restores to the trigger on close, but Tab
 * isn't cycled within it — the rest of the page stays reachable.
 *
 * @example
 * ```tsx
 * <PopoverContent side="bottom" align="start" sideOffset={4}>
 *   {filters}
 * </PopoverContent>
 * ```
 */
const PopoverContent = React.forwardRef<HTMLDivElement, ScopedProps<PopoverContentProps>>(
  (props, forwardedRef) => {
    const {
      __scopePopover,
      forceMount = false,
      onEscapeKeyDown,
      onPointerDownOutside,
      side,
      sideOffset,
      align,
      alignOffset,
      avoidCollisions,
      collisionPadding,
      ...contentProps
    } = props;
    const context = usePopoverContext(POPOVER_CONTENT_NAME, __scopePopover);
    const popperScope = usePopperScope(__scopePopover);

    return (
      <Presence present={forceMount || context.open}>
        <DismissibleLayer
          asChild
          onEscapeKeyDown={onEscapeKeyDown}
          onPointerDownOutside={onPointerDownOutside}
          onDismiss={() => context.onOpenChange(false)}
        >
          <FocusScope asChild trapped={false}>
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
            />
          </FocusScope>
        </DismissibleLayer>
      </Presence>
    );
  },
);

PopoverContent.displayName = POPOVER_CONTENT_NAME;

export { PopoverContent };
export type { PopoverContentProps, Side, Align };
