
import { Primitive } from '@nebula/primitives/primitive';
import * as React from 'react';


import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';

const MENU_SEPARATOR_NAME = 'MenuSeparator';

type MenuSeparatorProps = PrimitivePropsWithRef<'div'>;

/**
 * A non-interactive divider between groups of `MenuItem`s. Not a
 * `FocusItem` — arrow-key navigation skips straight over it, matching
 * native menu separators.
 *
 * @example
 * ```tsx
 * <MenuItem onSelect={() => save()}>Save</MenuItem>
 * <MenuSeparator />
 * <MenuItem onSelect={() => remove()}>Delete</MenuItem>
 * ```
 */
const MenuSeparator = React.forwardRef<HTMLDivElement, MenuSeparatorProps>((props, forwardedRef) => (
  <Primitive as="div" role="separator" aria-orientation="horizontal" {...props} ref={forwardedRef} />
));

MenuSeparator.displayName = MENU_SEPARATOR_NAME;

export { MenuSeparator };
export type { MenuSeparatorProps };
