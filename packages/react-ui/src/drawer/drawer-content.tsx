import { DrawerContent as HeadlessDrawerContent } from '@nebula/headless/drawer';
import { cn } from '@nebula/primitives/cn';
import * as React from 'react';

import { DrawerClose } from './drawer-close';

import type { DrawerContentProps as HeadlessDrawerContentProps } from '@nebula/headless/drawer';

interface DrawerContentOwnProps {
  /** Hide the built-in top-right close icon. @default false */
  hideCloseButton?: boolean;
}

type DrawerContentProps = HeadlessDrawerContentProps & DrawerContentOwnProps;

/**
 * The sliding panel — fixed to whichever edge `side` (default `'right'`)
 * names, sized to a fixed cross-axis dimension and full-bleed on the other,
 * with a `data-[state=closed]` translate-out transform per side (this is the
 * "consumer's own CSS" work the headless `DrawerContent`'s doc comment
 * calls out as unowned by that layer). Sizing every side the same (20rem) is
 * a reasonable single default; a consumer overriding `side="top"`/`"bottom"`
 * for a shorter panel passes their own `className` height.
 */
const DrawerContent = React.forwardRef<HTMLDivElement, DrawerContentProps>(
  (props, forwardedRef) => {
    const { className, children, hideCloseButton = false, side = 'right', ...rest } = props;
    return (
      <HeadlessDrawerContent
        side={side}
        className={cn(
          'fixed z-50 flex flex-col border-[var(--drawer-content-border)] bg-[var(--drawer-content-bg)] p-6 text-[var(--drawer-text)] shadow-lg transition-transform focus-visible:outline-none',
          'data-[side=right]:inset-y-0 data-[side=right]:right-0 data-[side=right]:h-full data-[side=right]:w-80 data-[side=right]:border-l data-[side=right]:data-[state=closed]:translate-x-full',
          'data-[side=left]:inset-y-0 data-[side=left]:left-0 data-[side=left]:h-full data-[side=left]:w-80 data-[side=left]:border-r data-[side=left]:data-[state=closed]:-translate-x-full',
          'data-[side=top]:inset-x-0 data-[side=top]:top-0 data-[side=top]:w-full data-[side=top]:border-b data-[side=top]:data-[state=closed]:-translate-y-full',
          'data-[side=bottom]:inset-x-0 data-[side=bottom]:bottom-0 data-[side=bottom]:w-full data-[side=bottom]:border-t data-[side=bottom]:data-[state=closed]:translate-y-full',
          className,
        )}
        {...rest}
        ref={forwardedRef}
      >
        {children}
        {!hideCloseButton && (
          <DrawerClose
            aria-label="Close"
            className="absolute right-4 top-4 rounded-[var(--radius-selector)] p-1 text-[var(--drawer-text)]/60 hover:text-[var(--drawer-text)]"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </DrawerClose>
        )}
      </HeadlessDrawerContent>
    );
  },
);

DrawerContent.displayName = 'DrawerContent';

export { DrawerContent };
export type { DrawerContentProps };
export type { DrawerSide } from '@nebula/headless/drawer';
