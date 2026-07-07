import * as React from 'react';

import { Primitive } from '../primitive/primitive';


import { RovingFocusGroupProvider } from './roving-focus-context';

import type { Orientation, ScopedProps } from './roving-focus-context';
import type { PrimitivePropsWithRef } from '../primitive/primitive';

interface RovingFocusGroupProps extends PrimitivePropsWithRef<'div'> {
  /** @default 'horizontal' */
  orientation?: Orientation;
  /** Arrow key navigation wraps from the last item back to the first (and vice versa). @default false */
  loop?: boolean;
  /** Which item is the initial tab stop; defaults to whichever item registers first. */
  defaultCurrentTabStopId?: string;
}

/**
 * Implements the "roving tabindex" keyboard pattern shared by `Tabs`,
 * `RadioGroup`, `Menu`, and toolbars: only one item in the group is ever a
 * Tab stop (`tabIndex={0}`) at a time — everyone else is `tabIndex={-1}` —
 * and arrow keys move which item that is. Wrap a group of `FocusItem`s in
 * this to get that behavior generically instead of re-implementing it per
 * component (see `@nebula/headless`'s `Tabs`, which currently hand-rolls an
 * equivalent of this and is a candidate to migrate onto it).
 *
 * @example
 * ```tsx
 * <RovingFocusGroup orientation="horizontal" loop>
 *   <FocusItem asChild><button>One</button></FocusItem>
 *   <FocusItem asChild><button>Two</button></FocusItem>
 *   <FocusItem asChild><button>Three</button></FocusItem>
 * </RovingFocusGroup>
 * ```
 */
const RovingFocusGroup = React.forwardRef<HTMLDivElement, ScopedProps<RovingFocusGroupProps>>(
  (props, forwardedRef) => {
    const {
      __scopeRovingFocusGroup,
      orientation = 'horizontal',
      loop = false,
      defaultCurrentTabStopId,
      ...groupProps
    } = props;

    const itemsRef = React.useRef(new Map<string, HTMLElement>());
    const [currentTabStopId, setCurrentTabStopId] = React.useState<string | null>(
      defaultCurrentTabStopId ?? null,
    );

    const registerItem = React.useCallback((id: string, node: HTMLElement) => {
      itemsRef.current.set(id, node);
      setCurrentTabStopId((current) => current ?? id);
      return () => {
        itemsRef.current.delete(id);
      };
    }, []);

    const getItems = React.useCallback(() => {
      return Array.from(itemsRef.current.entries())
        .map(([id, node]) => ({ id, node }))
        .sort((a, b) => {
          const position = a.node.compareDocumentPosition(b.node);
           
          return position & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
        });
    }, []);

    return (
      <RovingFocusGroupProvider
        scope={__scopeRovingFocusGroup}
        orientation={orientation}
        loop={loop}
        currentTabStopId={currentTabStopId}
        onItemFocus={setCurrentTabStopId}
        onItemShiftTab={() => setCurrentTabStopId(null)}
        getItems={getItems}
        registerItem={registerItem}
      >
        <Primitive as="div" data-orientation={orientation} {...groupProps} ref={forwardedRef} />
      </RovingFocusGroupProvider>
    );
  },
);

RovingFocusGroup.displayName = 'RovingFocusGroup';

export { RovingFocusGroup };
export type { RovingFocusGroupProps };
