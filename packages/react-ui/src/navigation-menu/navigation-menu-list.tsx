import { cn } from '@nebula/primitives/cn';
import { NavigationMenuList as StylelessNavigationMenuList } from '@nebula/styleless/navigation-menu';
import * as React from 'react';

import type { NavigationMenuListProps as StylelessNavigationMenuListProps } from '@nebula/styleless/navigation-menu';

type NavigationMenuListProps = StylelessNavigationMenuListProps;

/** Lays top-level items out in a row — mirrors `TabList`'s row layout. */
const NavigationMenuList = React.forwardRef<HTMLUListElement, NavigationMenuListProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <StylelessNavigationMenuList
        className={cn('flex items-center gap-1', className)}
        {...rest}
        ref={forwardedRef}
      />
    );
  },
);

NavigationMenuList.displayName = 'NavigationMenuList';

export { NavigationMenuList };
export type { NavigationMenuListProps };
