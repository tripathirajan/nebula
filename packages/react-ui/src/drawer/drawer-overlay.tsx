import { DrawerOverlay as HeadlessDrawerOverlay } from '@nebula-lab/headless/drawer';
import { cn } from '@nebula-lab/primitives/cn';
import * as React from 'react';

import { backdropVariantClassName } from '../backdrop';

import type { BackdropBlurIntensity } from '../backdrop';
import type { DrawerOverlayProps as HeadlessDrawerOverlayProps } from '@nebula-lab/headless/drawer';

interface DrawerOverlayOwnProps {
  /**
   * Same `backdrop` contract as `DialogOverlay`'s own doc — `'solid'`
   * (default) is the flat 50%-opacity tint, `'blur'` is a real frosted-glass
   * material (blur + saturation boost). Styling decision lives in the shared
   * `backdropVariantClassName` (`../backdrop/backdrop.tsx`), so `Dialog`,
   * `Drawer`, and the standalone `Backdrop` all agree on what "blur" means.
   */
  backdrop?: 'solid' | 'blur';
  /** Same `blurIntensity` contract as `Backdrop`'s own prop — ignored when `backdrop="solid"`. @default 'regular' */
  blurIntensity?: BackdropBlurIntensity;
}

type DrawerOverlayProps = HeadlessDrawerOverlayProps & DrawerOverlayOwnProps;

/** The dimmed backdrop — styled off `--drawer-overlay-bg` (see `../tokens/component.ts`), kept as its own token rather than reusing `--dialog-overlay-bg` even though both currently point at the same semantic color, so restyling one doesn't silently affect the other. */
const DrawerOverlay = React.forwardRef<HTMLDivElement, DrawerOverlayProps>(
  (props, forwardedRef) => {
    const { className, backdrop = 'solid', blurIntensity = 'regular', ...rest } = props;
    return (
      <HeadlessDrawerOverlay
        className={cn(
          'fixed inset-0 z-[var(--z-overlay)]',
          backdropVariantClassName(backdrop, 'var(--drawer-overlay-bg)', blurIntensity),
          className,
        )}
        {...rest}
        ref={forwardedRef}
      />
    );
  },
);

DrawerOverlay.displayName = 'DrawerOverlay';

export { DrawerOverlay };
export type { DrawerOverlayProps };
