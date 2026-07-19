import { NavigationMenuContent as HeadlessNavigationMenuContent } from '@nebula-lab/headless/navigation-menu';
import { cn } from '@nebula-lab/primitives/cn';
import * as React from 'react';

import type { NavigationMenuContentProps as HeadlessNavigationMenuContentProps } from '@nebula-lab/headless/navigation-menu';

type NavigationMenuContentProps = HeadlessNavigationMenuContentProps;

/**
 * The mega-menu panel — same `base-100`/`base-300`/`base-content` surface
 * triple as `PopoverContent`/`DialogContent` (see `../tokens/component.ts`'s
 * header comment for why), including the same fade/scale `data-[state]`
 * transition (see `PopoverContent`'s doc comment for why). Shadow reads
 * `--elevation-anchored`, not `--elevation-modal` — despite previously
 * hardcoding `shadow-lg`, this is functionally a trigger-following panel
 * (built on the same positioning system as `Popover`/`Menu`), not a
 * centered surface that takes over the interaction; the elevation-token
 * pass corrected this to match its actual category.
 */
const NavigationMenuContent = React.forwardRef<HTMLDivElement, NavigationMenuContentProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <HeadlessNavigationMenuContent
        className={cn(
          'z-[var(--z-overlay)] min-w-[16rem] rounded-[var(--radius-box)] border border-[var(--navigation-menu-content-border)] bg-[var(--navigation-menu-content-bg)] p-4 text-[var(--navigation-menu-trigger-text)] shadow-[var(--elevation-anchored)] transition-[opacity,transform] duration-[var(--motion-duration-fast)] ease-[var(--motion-ease-out)] focus-visible:outline-none data-[state=closed]:scale-95 data-[state=closed]:opacity-0 data-[state=open]:scale-100 data-[state=open]:opacity-100',
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
