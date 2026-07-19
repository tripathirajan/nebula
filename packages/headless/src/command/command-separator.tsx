import { Primitive } from '@nebula-lab/primitives/primitive';
import * as React from 'react';

import type { PrimitivePropsWithRef } from '@nebula-lab/primitives/primitive';

const COMMAND_SEPARATOR_NAME = 'CommandSeparator';

type CommandSeparatorProps = PrimitivePropsWithRef<'div'>;

/**
 * A decorative divider between `CommandGroup`s — `aria-hidden`, same
 * treatment `BreadcrumbSeparator`/`PaginationEllipsis` get, since group
 * order alone already conveys the structure to assistive tech.
 *
 * @example
 * ```tsx
 * <CommandGroup heading="Actions">...</CommandGroup>
 * <CommandSeparator />
 * <CommandGroup heading="Recent">...</CommandGroup>
 * ```
 */
const CommandSeparator = React.forwardRef<HTMLDivElement, CommandSeparatorProps>(
  (props, forwardedRef) => <Primitive as="div" aria-hidden="true" {...props} ref={forwardedRef} />,
);

CommandSeparator.displayName = COMMAND_SEPARATOR_NAME;

export { CommandSeparator };
export type { CommandSeparatorProps };
