import { cn } from '@nebula/primitives/cn';
import { NavigationMenuTrigger as StylelessNavigationMenuTrigger } from '@nebula/styleless/navigation-menu';
import * as React from 'react';

import type { NavigationMenuTriggerProps as StylelessNavigationMenuTriggerProps } from '@nebula/styleless/navigation-menu';

type NavigationMenuTriggerProps = StylelessNavigationMenuTriggerProps;

/** Built-in chevron rotates 180° when `data-state="open"` — same `data-[state=open]:rotate-180` treatment `AccordionTrigger` uses. */
const NavigationMenuTrigger = React.forwardRef<HTMLButtonElement, NavigationMenuTriggerProps>(
  (props, forwardedRef) => {
    const { className, children, ...rest } = props;
    return (
      <StylelessNavigationMenuTrigger
        className={cn(
          'group flex items-center gap-1 rounded-[var(--radius-selector)] px-3 py-2 text-sm font-medium text-[var(--navigation-menu-trigger-text)] outline-none hover:bg-[var(--navigation-menu-trigger-hover-bg)] focus-visible:ring-2 focus-visible:ring-[var(--navigation-menu-link-active-text)]',
          className,
        )}
        {...rest}
        ref={forwardedRef}
      >
        {children}
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-3 w-3 shrink-0 transition-transform group-data-[state=open]:rotate-180"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </StylelessNavigationMenuTrigger>
    );
  },
);

NavigationMenuTrigger.displayName = 'NavigationMenuTrigger';

export { NavigationMenuTrigger };
export type { NavigationMenuTriggerProps };
