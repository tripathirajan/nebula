
import { composeEventHandlers } from '@nebula-lab/primitives/compose-event-handlers';
import { usePopperContext } from '@nebula-lab/primitives/popper';
import { Primitive } from '@nebula-lab/primitives/primitive';
import * as React from 'react';


import { useMenuContext, usePopperScope } from '../menu/menu-context';

import type { ScopedProps } from '../menu/menu-context';
import type { PrimitivePropsWithRef } from '@nebula-lab/primitives/primitive';

const CONTEXT_MENU_TRIGGER_NAME = 'ContextMenuTrigger';

type ContextMenuTriggerProps = PrimitivePropsWithRef<'div'>;

/**
 * Wraps arbitrary content (a table row, a canvas, a card — anything the user
 * right-clicks on) and opens the menu positioned at the pointer, instead of
 * `MenuTrigger`'s click-a-visible-button model. Renders a plain `div` with no
 * `aria-haspopup`/`aria-expanded` wiring: a right-click surface isn't itself
 * an interactive control the way a menu button is, so there's nothing to
 * announce on the trigger element itself — `ContextMenuContent`'s own
 * `role="menu"` (inherited from `MenuContent`) is what assistive tech
 * actually needs to know about, once opened.
 *
 * Positions the menu at the click point via a virtual anchor: a duck-typed
 * object exposing only `getBoundingClientRect()` (the only method
 * `PopperContent` ever calls on the anchor — see `popper-content.tsx`),
 * cast to `HTMLElement` and pushed directly into `Popper`'s context via
 * `usePopperContext`. This avoids needing a second, point-based positioning
 * primitive alongside `Popper` — the same technique Radix's `ContextMenu`
 * uses. The virtual anchor is zero-sized (`width`/`height` 0) at the pointer
 * coordinates, so `PopperContent`'s existing side/align math places content
 * relative to that single point rather than a real element's box.
 *
 * Note this intentionally does *not* wrap itself in `PopperAnchor`: unlike
 * `MenuTrigger`/`PopoverTrigger`, this trigger's own DOM rect is never the
 * thing content gets positioned against, so registering it as the anchor on
 * mount (what `PopperAnchor` does) would be immediately overwritten by the
 * virtual point anchor on the next right-click anyway — going straight to
 * `usePopperContext` avoids that redundant registration.
 *
 * @example
 * ```tsx
 * <ContextMenuTrigger>
 *   <div className="rounded border p-4">Right-click me</div>
 * </ContextMenuTrigger>
 * ```
 */
const ContextMenuTrigger = React.forwardRef<HTMLDivElement, ScopedProps<ContextMenuTriggerProps>>(
  (props, forwardedRef) => {
    const { __scopeMenu, onContextMenu, ...triggerProps } = props;
    const context = useMenuContext(CONTEXT_MENU_TRIGGER_NAME, __scopeMenu);
    const popperScope = usePopperScope(__scopeMenu);
    const popperContext = usePopperContext(CONTEXT_MENU_TRIGGER_NAME, popperScope.__scopePopper);

    return (
      <Primitive
        as="div"
        {...triggerProps}
        ref={forwardedRef}
        onContextMenu={composeEventHandlers(onContextMenu, (event) => {
          event.preventDefault();
          const { clientX, clientY } = event;
          popperContext.onAnchorChange({
            getBoundingClientRect: () =>
              ({
                width: 0,
                height: 0,
                top: clientY,
                bottom: clientY,
                left: clientX,
                right: clientX,
                x: clientX,
                y: clientY,
                toJSON() {
                  return this;
                },
              }) satisfies DOMRect,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any -- virtual point-anchor duck-types only the one method PopperContent calls (see doc comment above); it is not a real HTMLElement.
          } as any);
          context.onOpenChange(true);
        })}
      />
    );
  },
);

ContextMenuTrigger.displayName = CONTEXT_MENU_TRIGGER_NAME;

export { ContextMenuTrigger };
export type { ContextMenuTriggerProps };
