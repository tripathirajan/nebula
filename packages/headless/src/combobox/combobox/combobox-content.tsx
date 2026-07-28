import { useComposedRefs } from '@nebula-lab/primitives/compose-refs';
import { DismissibleLayer } from '@nebula-lab/primitives/dismissible-layer';
import { PopperContent } from '@nebula-lab/primitives/popper';
import { Presence } from '@nebula-lab/primitives/presence';
import * as React from 'react';

import { useComboboxContext, usePopperScope } from './combobox-context';

import type { ScopedProps } from './combobox-context';
import type { Align, PopperContentProps, Side } from '@nebula-lab/primitives/popper';

const COMBOBOX_CONTENT_NAME = 'ComboboxContent';

interface ComboboxContentProps
  extends Pick<
    PopperContentProps,
    'side' | 'sideOffset' | 'align' | 'alignOffset' | 'avoidCollisions' | 'collisionPadding'
  > {
  className?: string;
  children?: React.ReactNode;
  forceMount?: boolean;
}

/**
 * `role="listbox"`, anchor-positioned against `ComboboxInput` via
 * `@nebula-lab/primitives`' `PopperContent`. Deliberately NOT wrapped in
 * `FocusScope` (unlike `SelectContent`/`PopoverContent`) — DOM focus must
 * stay on `ComboboxInput` the entire time the popup is open, since that's
 * where typing happens; dismissal on outside-pointerdown is still handled
 * via `DismissibleLayer`, it just never tries to move focus anywhere.
 *
 * @example
 * ```tsx
 * <ComboboxContent side="bottom" align="start">
 *   <ComboboxItem value="apple">Apple</ComboboxItem>
 * </ComboboxContent>
 * ```
 */
const ComboboxContent = React.forwardRef<HTMLDivElement, ScopedProps<ComboboxContentProps>>(
  (props, forwardedRef) => {
    const {
      __scopeCombobox,
      forceMount = false,
      side,
      sideOffset,
      align,
      alignOffset,
      avoidCollisions,
      collisionPadding,
      ...contentProps
    } = props;
    const context = useComboboxContext(COMBOBOX_CONTENT_NAME, __scopeCombobox);
    const popperScope = usePopperScope(__scopeCombobox);
    const composedRef = useComposedRefs(forwardedRef, context.contentRef);

    return (
      <Presence present={forceMount || context.open}>
        <DismissibleLayer
          asChild
          onPointerDownOutside={(event) => {
            // The input itself is a valid "inside" target — clicking back
            // into it shouldn't be treated as dismissing the popup (there's
            // no separate trigger element the way `Select`/`Popover` have
            // one; the input IS the anchor).
            const target = event.target as Node;
            if (target instanceof Node && document.getElementById(context.inputId)?.contains(target)) {
              event.preventDefault();
            }
          }}
          onDismiss={() => context.onOpenChange(false)}
        >
          <PopperContent
            {...popperScope}
            side={side}
            sideOffset={sideOffset}
            align={align}
            alignOffset={alignOffset}
            avoidCollisions={avoidCollisions}
            collisionPadding={collisionPadding}
            role="listbox"
            id={context.contentId}
            data-state={context.open ? 'open' : 'closed'}
            {...contentProps}
            ref={composedRef}
          />
        </DismissibleLayer>
      </Presence>
    );
  },
);

ComboboxContent.displayName = COMBOBOX_CONTENT_NAME;

export { ComboboxContent };
export type { ComboboxContentProps, Side, Align };
