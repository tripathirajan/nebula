import { NavigationMenuList as HeadlessNavigationMenuList } from '@nebula/headless/navigation-menu';
import { cn } from '@nebula/primitives/cn';
import * as React from 'react';

import type { NavigationMenuListProps as HeadlessNavigationMenuListProps } from '@nebula/headless/navigation-menu';

type NavigationMenuListProps = HeadlessNavigationMenuListProps;

/** Lays top-level items out in a row — mirrors `TabList`'s row layout. */
const NavigationMenuList = React.forwardRef<HTMLUListElement, NavigationMenuListProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <HeadlessNavigationMenuList
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
