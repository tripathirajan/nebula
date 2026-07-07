import { composeEventHandlers } from '@nebula/primitives/compose-event-handlers';
import { Primitive } from '@nebula/primitives/primitive';
import * as React from 'react';

import { useCommandContext } from './command-context';

import type { ScopedProps } from './command-context';
import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';

const COMMAND_ITEM_NAME = 'CommandItem';

interface CommandItemProps extends PrimitivePropsWithRef<'div'> {
  value: string;
  disabled?: boolean;
  /** Runs when this item is chosen — by click, or by Enter while it's `highlightedValue` (see `CommandInput`). Unlike `ComboboxItem`'s `onValueChange`, this doesn't fill any input; it's the command's actual action. */
  onSelect?: () => void;
}

/**
 * `role="option"` — highlighted state comes entirely from `Command`'s
 * `highlightedValue`, not local state or real DOM focus (focus always
 * stays on `CommandInput`, same as `ComboboxItem`). Hovering an item also
 * highlights it. Registers its own `onSelect` with the root (via a small
 * `Map` keyed by `value`, not a bare callback prop lookup) so
 * `CommandInput`'s Enter handler can run whichever item is currently
 * highlighted without needing a ref to it.
 *
 * @example
 * ```tsx
 * <CommandItem value="new-file" onSelect={() => createFile()}>New File</CommandItem>
 * ```
 */
const CommandItem = React.forwardRef<HTMLDivElement, ScopedProps<CommandItemProps>>(
  (props, forwardedRef) => {
    const {
      __scopeCommand,
      value,
      disabled = false,
      onSelect,
      onClick,
      onPointerMove,
      ...itemProps
    } = props;
    const context = useCommandContext(COMMAND_ITEM_NAME, __scopeCommand);
    const highlighted = context.highlightedValue === value;

    React.useEffect(() => {
      context.registerItemSelect(value, () => onSelect?.());
      return () => context.unregisterItemSelect(value);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value, onSelect]);

    return (
      <Primitive
        as="div"
        id={context.getOptionId(value)}
        role="option"
        aria-selected={highlighted}
        aria-disabled={disabled || undefined}
        data-highlighted={highlighted ? '' : undefined}
        data-disabled={disabled ? '' : undefined}
        data-value={value}
        {...itemProps}
        ref={forwardedRef}
        onClick={composeEventHandlers(onClick, () => {
          if (!disabled) onSelect?.();
        })}
        onPointerMove={composeEventHandlers(onPointerMove, () => {
          if (!disabled) context.setHighlightedValue(value);
        })}
      />
    );
  },
);

CommandItem.displayName = COMMAND_ITEM_NAME;

export { CommandItem };
export type { CommandItemProps };
