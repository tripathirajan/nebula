import { NavigationMenuLink as HeadlessNavigationMenuLink } from '@nebula/headless/navigation-menu';
import { cn } from '@nebula/primitives/cn';
import * as React from 'react';

import type { NavigationMenuLinkProps as HeadlessNavigationMenuLinkProps } from '@nebula/headless/navigation-menu';

type NavigationMenuLinkProps = HeadlessNavigationMenuLinkProps;

/** A plain top-level link — `data-[active]` (set when `active` is passed) recolors the text via `--navigation-menu-link-active-text`, same convention `PaginationLink`'s active fill uses but text-only since a link isn't a button-shaped hit target. */
const NavigationMenuLink = React.forwardRef<HTMLAnchorElement, NavigationMenuLinkProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <HeadlessNavigationMenuLink
        className={cn(
          'rounded-[var(--radius-selector)] px-3 py-2 text-sm font-medium text-[var(--navigation-menu-trigger-text)] outline-none hover:bg-[var(--navigation-menu-trigger-hover-bg)] focus-visible:ring-2 focus-visible:ring-[var(--navigation-menu-link-active-text)] data-[active]:text-[var(--navigation-menu-link-active-text)]',
          className,
        )}
        {...rest}
        ref={forwardedRef}
      />
    );
  },
);

NavigationMenuLink.displayName = 'NavigationMenuLink';

export { NavigationMenuLink };
export type { NavigationMenuLinkProps };
