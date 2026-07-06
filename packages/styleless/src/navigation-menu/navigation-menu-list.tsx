import { Primitive } from '@nebula/primitives/primitive';
import { RovingFocusGroup } from '@nebula/primitives/roving-focus-group';
import * as React from 'react';

import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';

type NavigationMenuListProps = PrimitivePropsWithRef<'ul'>;

/**
 * `<ul>` wrapper for `NavigationMenuItem`s, wrapped in
 * `@nebula/primitives`' `RovingFocusGroup` (horizontal, looping) so
 * Left/Right arrow keys move focus between sibling triggers/links — same
 * technique `Menubar` uses for its top-level triggers.
 *
 * @example
 * ```tsx
 * <NavigationMenuList>
 *   <NavigationMenuItem value="products">...</NavigationMenuItem>
 * </NavigationMenuList>
 * ```
 */
const NavigationMenuList = React.forwardRef<HTMLUListElement, NavigationMenuListProps>(
  (props, forwardedRef) => (
    <RovingFocusGroup asChild orientation="horizontal" loop>
      <Primitive as="ul" {...props} ref={forwardedRef} />
    </RovingFocusGroup>
  ),
);

NavigationMenuList.displayName = 'NavigationMenuList';

export { NavigationMenuList };
export type { NavigationMenuListProps };
