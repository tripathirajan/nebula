import { DrawerOverlay as HeadlessDrawerOverlay } from '@nebula/headless/drawer';
import { cn } from '@nebula/primitives/cn';
import * as React from 'react';

import type { DrawerOverlayProps as HeadlessDrawerOverlayProps } from '@nebula/headless/drawer';

type DrawerOverlayProps = HeadlessDrawerOverlayProps;

/** The dimmed backdrop — styled off `--drawer-overlay-bg` (see `../tokens/component.ts`), kept as its own token rather than reusing `--dialog-overlay-bg` even though both currently point at the same semantic color, so restyling one doesn't silently affect the other. */
const DrawerOverlay = React.forwardRef<HTMLDivElement, DrawerOverlayProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <HeadlessDrawerOverlay
        className={cn('fixed inset-0 z-[var(--z-overlay)] bg-[var(--drawer-overlay-bg)]/50', className)}
        {...rest}
        ref={forwardedRef}
      />
    );
  },
);

DrawerOverlay.displayName = 'DrawerOverlay';

export { DrawerOverlay };
export type { DrawerOverlayProps };
