import { composeEventHandlers } from '@nebula/primitives/compose-event-handlers';
import { PopperAnchor } from '@nebula/primitives/popper';
import { Primitive } from '@nebula/primitives/primitive';
import * as React from 'react';

import { useSelectContext, usePopperScope } from './select-context';

import type { ScopedProps } from './select-context';
import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';

const SELECT_TRIGGER_NAME = 'SelectTrigger';

type SelectTriggerProps = PrimitivePropsWithRef<'button'>;

/**
 * `aria-haspopup="listbox"` per the WAI-ARIA
 * [collapsible listbox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/examples/listbox-collapsible/)
 * — a plain button, not `role="combobox"` (that role is for the *editable*
 * combobox pattern `Combobox` builds separately; a `Select` trigger never
 * accepts typed text). Also doubles as `PopperAnchor` (via `asChild`), same
 * technique `PopoverTrigger` uses, so `SelectContent` positions against it
 * with no separate anchor element needed. ArrowDown/ArrowUp/Enter/Space all
 * open the popup — moving focus into it from there is `FocusScope`'s job
 * (see `SelectContent`), the same division of responsibility `Dialog`'s
 * trigger/content have.
 *
 * @example
 * ```tsx
 * <SelectTrigger>
 *   <SelectValue placeholder="Pick a fruit" />
 * </SelectTrigger>
 * ```
 */
const SelectTrigger = React.forwardRef<HTMLButtonElement, ScopedProps<SelectTriggerProps>>(
  (props, forwardedRef) => {
    const { __scopeSelect, onClick, onKeyDown, disabled: disabledProp, ...triggerProps } = props;
    const context = useSelectContext(SELECT_TRIGGER_NAME, __scopeSelect);
    const popperScope = usePopperScope(__scopeSelect);
    const disabled = disabledProp || context.disabled;

    return (
      <PopperAnchor asChild {...popperScope}>
        <Primitive
          as="button"
          type="button"
          aria-haspopup="listbox"
          aria-expanded={context.open}
          aria-controls={context.contentId}
          data-state={context.open ? 'open' : 'closed'}
          data-disabled={disabled ? '' : undefined}
          disabled={disabled}
          {...triggerProps}
          ref={forwardedRef}
          onClick={composeEventHandlers(onClick, () => {
            if (!disabled) context.onOpenChange(!context.open);
          })}
          onKeyDown={composeEventHandlers(onKeyDown, (event) => {
            if (disabled) return;
            if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              context.onOpenChange(true);
            }
          })}
        />
      </PopperAnchor>
    );
  },
);

SelectTrigger.displayName = SELECT_TRIGGER_NAME;

export { SelectTrigger };
export type { SelectTriggerProps };
