import { useId } from '@nebula-lab/hooks';
import { Primitive } from '@nebula-lab/primitives/primitive';
import * as React from 'react';

import type { PrimitivePropsWithRef } from '@nebula-lab/primitives/primitive';

const COMMAND_GROUP_NAME = 'CommandGroup';

interface CommandGroupProps extends PrimitivePropsWithRef<'div'> {
  /** Rendered as the group's visible label, and wired to `aria-labelledby` — takes a plain heading prop rather than a separate `CommandGroupHeading` sub-component + context, since a group's heading is always exactly one simple piece of text with no independent state of its own. */
  heading?: React.ReactNode;
}

/**
 * `role="group"` wrapping a labeled cluster of `CommandItem`s, e.g. all the
 * "Actions" or all the "Recent files" together — purely organizational, no
 * effect on `CommandInput`'s arrow-key navigation (which always just walks
 * every visible `[role="option"]` regardless of which group it's in).
 *
 * @example
 * ```tsx
 * <CommandGroup heading="Actions">
 *   <CommandItem value="new-file" onSelect={createFile}>New File</CommandItem>
 * </CommandGroup>
 * ```
 */
const CommandGroup = React.forwardRef<HTMLDivElement, CommandGroupProps>((props, forwardedRef) => {
  const { heading, children, ...groupProps } = props;
  const headingId = useId('nebula-command-group-heading');

  return (
    <Primitive
      as="div"
      role="group"
      aria-labelledby={heading !== undefined ? headingId : undefined}
      {...groupProps}
      ref={forwardedRef}
    >
      {heading !== undefined ? <div id={headingId}>{heading}</div> : null}
      {children}
    </Primitive>
  );
});

CommandGroup.displayName = COMMAND_GROUP_NAME;

export { CommandGroup };
export type { CommandGroupProps };
