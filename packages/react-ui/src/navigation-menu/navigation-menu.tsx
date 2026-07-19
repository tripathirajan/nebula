import { NavigationMenu as HeadlessNavigationMenu } from '@nebula-lab/headless/navigation-menu';
import { cn } from '@nebula-lab/primitives/cn';
import * as React from 'react';

import type { NavigationMenuProps as HeadlessNavigationMenuProps } from '@nebula-lab/headless/navigation-menu';

type NavigationMenuProps = HeadlessNavigationMenuProps;

/** Root `<nav>` — relative positioning so a consumer's own `NavigationMenuContent` can be absolutely placed against it if not portalled. */
const NavigationMenu = React.forwardRef<HTMLElement, NavigationMenuProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <HeadlessNavigationMenu
        className={cn('relative', className)}
        {...rest}
        ref={forwardedRef}
      />
    );
  },
);

NavigationMenu.displayName = 'NavigationMenu';

export { NavigationMenu };
export type { NavigationMenuProps };
