import { cn } from '@nebula/primitives/cn';
import { NavigationMenu as StylelessNavigationMenu } from '@nebula/styleless/navigation-menu';
import * as React from 'react';

import type { NavigationMenuProps as StylelessNavigationMenuProps } from '@nebula/styleless/navigation-menu';

type NavigationMenuProps = StylelessNavigationMenuProps;

/** Root `<nav>` — relative positioning so a consumer's own `NavigationMenuContent` can be absolutely placed against it if not portalled. */
const NavigationMenu = React.forwardRef<HTMLElement, NavigationMenuProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <StylelessNavigationMenu
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
