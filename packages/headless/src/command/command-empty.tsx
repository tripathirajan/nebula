import { Primitive } from '@nebula-lab/primitives/primitive';
import * as React from 'react';

import type { PrimitivePropsWithRef } from '@nebula-lab/primitives/primitive';

const COMMAND_EMPTY_NAME = 'CommandEmpty';

type CommandEmptyProps = PrimitivePropsWithRef<'div'>;

/**
 * "No results" state — rendered by the consumer when their own filtering
 * left zero `CommandItem`s, same "consumer controls it, nothing automatic"
 * convention `Combobox` leaves filtering to. Not `role="option"`; it's just
 * informational text inside `CommandList`.
 *
 * @example
 * ```tsx
 * <CommandList>
 *   {filtered.length === 0 && <CommandEmpty>No results found.</CommandEmpty>}
 *   ...
 * </CommandList>
 * ```
 */
const CommandEmpty = React.forwardRef<HTMLDivElement, CommandEmptyProps>((props, forwardedRef) => (
  <Primitive as="div" role="presentation" {...props} ref={forwardedRef} />
));

CommandEmpty.displayName = COMMAND_EMPTY_NAME;

export { CommandEmpty };
export type { CommandEmptyProps };
