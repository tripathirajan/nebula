
import { Primitive } from '@nebula-lab/primitives/primitive';
import * as React from 'react';


import type { PrimitivePropsWithRef } from '@nebula-lab/primitives/primitive';

const MENU_LABEL_NAME = 'MenuLabel';

type MenuLabelProps = PrimitivePropsWithRef<'div'>;

/**
 * A non-interactive heading above a group of related `MenuItem`s (e.g.
 * "Actions"). Not a `FocusItem` — same reasoning as `MenuSeparator`.
 *
 * @example
 * ```tsx
 * <MenuLabel>Actions</MenuLabel>
 * <MenuItem onSelect={() => save()}>Save</MenuItem>
 * ```
 */
const MenuLabel = React.forwardRef<HTMLDivElement, MenuLabelProps>((props, forwardedRef) => (
  <Primitive as="div" {...props} ref={forwardedRef} />
));

MenuLabel.displayName = MENU_LABEL_NAME;

export { MenuLabel };
export type { MenuLabelProps };
