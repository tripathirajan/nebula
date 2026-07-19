import { useComposedRefs } from '@nebula-lab/primitives/compose-refs';
import { Primitive } from '@nebula-lab/primitives/primitive';
import * as React from 'react';

import { useCommandContext } from './command-context';

import type { ScopedProps } from './command-context';
import type { PrimitivePropsWithRef } from '@nebula-lab/primitives/primitive';

const COMMAND_LIST_NAME = 'CommandList';

type CommandListProps = PrimitivePropsWithRef<'div'>;

/**
 * `role="listbox"` — always mounted and visible (unlike `ComboboxContent`,
 * there's no `Presence`/open-state gating here, since `Command` has no
 * concept of "closed"). Holds the ref `CommandInput`'s arrow-key handling
 * queries `[role="option"]` elements from directly.
 *
 * @example
 * ```tsx
 * <CommandList>
 *   <CommandItem value="new-file" onSelect={createFile}>New File</CommandItem>
 * </CommandList>
 * ```
 */
const CommandList = React.forwardRef<HTMLDivElement, ScopedProps<CommandListProps>>(
  (props, forwardedRef) => {
    const { __scopeCommand, ...listProps } = props;
    const context = useCommandContext(COMMAND_LIST_NAME, __scopeCommand);
    const composedRef = useComposedRefs(forwardedRef, context.listRef);

    return (
      <Primitive as="div" role="listbox" id={context.listId} {...listProps} ref={composedRef} />
    );
  },
);

CommandList.displayName = COMMAND_LIST_NAME;

export { CommandList };
export type { CommandListProps };
