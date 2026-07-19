import { DismissibleLayer } from '@nebula-lab/primitives/dismissible-layer';
import { FocusScope } from '@nebula-lab/primitives/focus-scope';
import { PopperContent } from '@nebula-lab/primitives/popper';
import { Presence } from '@nebula-lab/primitives/presence';
import * as React from 'react';

import { Listbox } from '../listbox/listbox';

import { useSelectContext, usePopperScope } from './select-context';

import type { ScopedProps } from './select-context';
import type { Align, PopperContentProps, Side } from '@nebula-lab/primitives/popper';

const SELECT_CONTENT_NAME = 'SelectContent';

interface SelectContentProps
  extends Pick<
    PopperContentProps,
    'side' | 'sideOffset' | 'align' | 'alignOffset' | 'avoidCollisions' | 'collisionPadding'
  > {
  className?: string;
  children?: React.ReactNode;
  forceMount?: boolean;
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  onPointerDownOutside?: (event: PointerEvent) => void;
}

/**
 * `role="listbox"`, anchor-positioned against `SelectTrigger` via
 * `@nebula-lab/primitives`' `PopperContent` — same `Presence` > `DismissibleLayer`
 * > `FocusScope` > (positioning) `asChild` chain `PopoverContent` uses, with
 * one more link added: `Listbox` (`type="single"`, no explicit scope passed
 * — it mints its own default-scoped context, the same "ambient, unscoped
 * reuse" technique `DropdownMenu` uses for `Menu`'s context) collapses onto
 * `PopperContent` the same way every other layer here collapses onto the
 * next, so `SelectItem`s (thin `ListboxOption` wrappers, see that file) find
 * this `Listbox`'s roving-tabindex + typeahead behavior via ordinary React
 * context with zero extra wiring in this file.
 *
 * @example
 * ```tsx
 * <SelectContent side="bottom" align="start">
 *   <SelectItem value="apple">Apple</SelectItem>
 * </SelectContent>
 * ```
 */
const SelectContent = React.forwardRef<HTMLDivElement, ScopedProps<SelectContentProps>>(
  (props, forwardedRef) => {
    const {
      __scopeSelect,
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
    const context = useSelectContext(SELECT_CONTENT_NAME, __scopeSelect);
    const popperScope = usePopperScope(__scopeSelect);

    return (
      <Presence present={forceMount || context.open}>
        <DismissibleLayer
          asChild
          onEscapeKeyDown={onEscapeKeyDown}
          onPointerDownOutside={onPointerDownOutside}
          onDismiss={() => context.onOpenChange(false)}
        >
          <FocusScope asChild trapped={false}>
            <Listbox
              asChild
              type="single"
              value={context.value}
              onValueChange={(next) => {
                if (next) context.onValueChange(next);
              }}
            >
              <PopperContent
                {...popperScope}
                side={side}
                sideOffset={sideOffset}
                align={align}
                alignOffset={alignOffset}
                avoidCollisions={avoidCollisions}
                collisionPadding={collisionPadding}
                id={context.contentId}
                data-state={context.open ? 'open' : 'closed'}
                {...contentProps}
                ref={forwardedRef}
              />
            </Listbox>
          </FocusScope>
        </DismissibleLayer>
      </Presence>
    );
  },
);

SelectContent.displayName = SELECT_CONTENT_NAME;

export { SelectContent };
export type { SelectContentProps, Side, Align };
