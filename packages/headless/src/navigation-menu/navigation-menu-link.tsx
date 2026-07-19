import { Primitive } from '@nebula-lab/primitives/primitive';
import { FocusItem } from '@nebula-lab/primitives/roving-focus-group';
import * as React from 'react';

import type { PrimitivePropsWithRef } from '@nebula-lab/primitives/primitive';

const NAVIGATION_MENU_LINK_NAME = 'NavigationMenuLink';

interface NavigationMenuLinkProps extends PrimitivePropsWithRef<'a'> {
  /** Whether this link represents the current page — sets `aria-current="page"`, per the same convention `BreadcrumbPage`/`PaginationLink` use. */
  active?: boolean;
}

/**
 * A plain top-level nav link with no dropdown content — the counterpart to
 * a `NavigationMenuTrigger` + `NavigationMenuContent` pair, for items like
 * `NavigationMenuItem value="docs"`'s single "Docs" link that just
 * navigates directly. Registers into the enclosing `NavigationMenuList`'s
 * `RovingFocusGroup` via `FocusItem`, same as `NavigationMenuTrigger`, so
 * Left/Right arrow keys move between links and triggers alike.
 *
 * @example
 * ```tsx
 * <NavigationMenuItem>
 *   <NavigationMenuLink href="/docs" active={pathname === '/docs'}>Docs</NavigationMenuLink>
 * </NavigationMenuItem>
 * ```
 */
const NavigationMenuLink = React.forwardRef<HTMLAnchorElement, NavigationMenuLinkProps>(
  (props, forwardedRef) => {
    const { active = false, ...linkProps } = props;

    return (
      <FocusItem asChild>
        <Primitive
          as="a"
          aria-current={active ? 'page' : undefined}
          data-active={active ? '' : undefined}
          {...linkProps}
          ref={forwardedRef}
        />
      </FocusItem>
    );
  },
);

NavigationMenuLink.displayName = NAVIGATION_MENU_LINK_NAME;

export { NavigationMenuLink };
export type { NavigationMenuLinkProps };
