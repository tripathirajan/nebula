import { NavigationMenuContent as HeadlessNavigationMenuContent } from '@nebula/headless/navigation-menu';
import { cn } from '@nebula/primitives/cn';
import * as React from 'react';

import type { NavigationMenuContentProps as HeadlessNavigationMenuContentProps } from '@nebula/headless/navigation-menu';

type NavigationMenuContentProps = HeadlessNavigationMenuContentProps;

/**
 * The mega-menu panel — same `base-100`/`base-300`/`base-content` surface
 * triple as `PopoverContent`/`DialogContent` (see `../tokens/component.ts`'s
 * header comment for why), including the same fade/scale `data-[state]`
 * transition (see `PopoverContent`'s doc comment for why).
 */
const NavigationMenuContent = React.forwardRef<HTMLDivElement, NavigationMenuContentProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <HeadlessNavigationMenuContent
        className={cn(
          'z-50 min-w-[16rem] rounded-[var(--radius-box)] border border-[var(--navigation-menu-content-border)] bg-[var(--navigation-menu-content-bg)] p-4 text-[var(--navigation-menu-trigger-text)] shadow-lg transition-[opacity,transform] duration-150 ease-out focus-visible:outline-none data-[state=closed]:scale-95 data-[state=closed]:opacity-0 data-[state=open]:scale-100 data-[state=open]:opacity-100',
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
