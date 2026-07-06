import { cn } from '@nebula/primitives/cn';
import { NavigationMenuContent as StylelessNavigationMenuContent } from '@nebula/styleless/navigation-menu';
import * as React from 'react';

import type { NavigationMenuContentProps as StylelessNavigationMenuContentProps } from '@nebula/styleless/navigation-menu';

type NavigationMenuContentProps = StylelessNavigationMenuContentProps;

/** The mega-menu panel — same `base-100`/`base-300`/`base-content` surface triple as `PopoverContent`/`DialogContent` (see `../tokens/component.ts`'s header comment for why). */
const NavigationMenuContent = React.forwardRef<HTMLDivElement, NavigationMenuContentProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <StylelessNavigationMenuContent
        className={cn(
          'z-50 min-w-[16rem] rounded-[var(--radius-box)] border border-[var(--navigation-menu-content-border)] bg-[var(--navigation-menu-content-bg)] p-4 text-[var(--navigation-menu-trigger-text)] shadow-lg focus-visible:outline-none',
          className,
        )}
        {...rest}
        ref={forwardedRef}
      />
    );
  },
);

NavigationMenuContent.displayName = 'NavigationMenuContent';

export { NavigationMenuContent };
export type { NavigationMenuContentProps };
