import * as React from 'react';

import { composeEventHandlers } from '../compose-event-handlers/compose-event-handlers';
import { useComposedRefs } from '../compose-refs/compose-refs';
import { Primitive } from '../primitive/primitive';


import { useRovingFocusGroupContext } from './roving-focus-context';

import type { ScopedProps } from './roving-focus-context';
import type { PrimitivePropsWithRef } from '../primitive/primitive';

const FOCUS_ITEM_NAME = 'FocusItem';

interface FocusItemProps extends PrimitivePropsWithRef<'span'> {
  /**
   * Registers this item without making it a valid Tab stop — for a
   * temporarily-disabled item that should stay in the DOM (and still be
   * skippable via arrow keys) without ever receiving focus.
   * @default true
   */
  focusable?: boolean;
}

/**
 * One focusable item inside a `RovingFocusGroup`. Sets its own `tabIndex`
 * (`0` if it's the group's current tab stop, `-1` otherwise) and handles
 * arrow-key navigation to the next/previous item — Home/End jump to the
 * first/last. Almost always used with `asChild` to wrap the actual
 * interactive element (a `button`, a `Tab`, ...) rather than rendering its
 * own tag.
 *
 * @example
 * ```tsx
 * <FocusItem asChild>
 *   <button onClick={() => select('one')}>One</button>
 * </FocusItem>
 * ```
 */
const FocusItem = React.forwardRef<HTMLElement, ScopedProps<FocusItemProps>>(
  (props, forwardedRef) => {
    const { __scopeRovingFocusGroup, focusable = true, onFocus, onKeyDown, ...itemProps } = props;
    const context = useRovingFocusGroupContext(FOCUS_ITEM_NAME, __scopeRovingFocusGroup);
    const id = React.useId();
    const nodeRef = React.useRef<HTMLElement>(null);
    const composedRef = useComposedRefs(forwardedRef, nodeRef);
    const isCurrentTabStop = context.currentTabStopId === id;

    React.useEffect(() => {
      if (!focusable) return undefined;
      const node = nodeRef.current;
      if (!node) return undefined;
      return context.registerItem(id, node);
    }, [id, focusable, context]);

    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (event.key === 'Tab' && event.shiftKey) {
        context.onItemShiftTab();
        return;
      }
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      const isHorizontal = context.orientation === 'horizontal';
      const nextKey = isHorizontal ? 'ArrowRight' : 'ArrowDown';
      const prevKey = isHorizontal ? 'ArrowLeft' : 'ArrowUp';

      if (![nextKey, prevKey, 'Home', 'End'].includes(event.key)) return;

      const items = context.getItems();
      if (items.length === 0) return;

      const currentIndex = items.findIndex(({ id: itemId }) => itemId === id);
      let nextIndex = currentIndex;

      if (event.key === 'Home') nextIndex = 0;
      else if (event.key === 'End') nextIndex = items.length - 1;
      else if (event.key === nextKey) {
        nextIndex = currentIndex + 1;
        if (nextIndex >= items.length) nextIndex = context.loop ? 0 : currentIndex;
      } else if (event.key === prevKey) {
        nextIndex = currentIndex - 1;
        if (nextIndex < 0) nextIndex = context.loop ? items.length - 1 : currentIndex;
      }

      if (nextIndex !== currentIndex) {
        event.preventDefault();
        items[nextIndex]?.node.focus();
      }
    };

    return (
      <Primitive
        as="span"
        tabIndex={isCurrentTabStop ? 0 : -1}
        data-orientation={context.orientation}
        {...itemProps}
        ref={composedRef}
        onFocus={composeEventHandlers(onFocus, () => context.onItemFocus(id))}
        onKeyDown={composeEventHandlers(onKeyDown, handleKeyDown)}
      />
    );
  },
);

FocusItem.displayName = FOCUS_ITEM_NAME;

export { FocusItem };
export type { FocusItemProps };
