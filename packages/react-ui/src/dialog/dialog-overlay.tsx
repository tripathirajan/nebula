import { DialogOverlay as HeadlessDialogOverlay } from '@nebula/headless/dialog';
import { cn } from '@nebula/primitives/cn';
import * as React from 'react';

import { backdropVariantClassName } from '../backdrop';

import type { BackdropBlurIntensity } from '../backdrop';
import type { DialogOverlayProps as HeadlessDialogOverlayProps } from '@nebula/headless/dialog';

interface DialogOverlayOwnProps {
  /**
   * `'solid'` (the default) is a flat `--dialog-overlay-bg` tint at 50%
   * opacity — unchanged from before this prop existed. `'blur'` is a real
   * frosted-glass material (blur + saturation boost, not just a blurred
   * tint) — see `Backdrop`'s own doc comment for why saturation matters.
   * The actual styling decision lives in `backdropVariantClassName`
   * (`../backdrop/backdrop.tsx`), shared with `DrawerOverlay` and the
   * standalone `Backdrop` component, so all three agree on what "blur"
   * means without three separate copies of the same class string.
   */
  backdrop?: 'solid' | 'blur';
  /** Same `blurIntensity` contract as `Backdrop`'s own prop — ignored when `backdrop="solid"`. @default 'regular' */
  blurIntensity?: BackdropBlurIntensity;
}

type DialogOverlayProps = HeadlessDialogOverlayProps & DialogOverlayOwnProps;

/** The dimmed backdrop — styled off `--dialog-overlay-bg` at low opacity (see `../tokens/component.ts`). */
const DialogOverlay = React.forwardRef<HTMLDivElement, DialogOverlayProps>(
  (props, forwardedRef) => {
    const { className, backdrop = 'solid', blurIntensity = 'regular', ...rest } = props;
    return (
      <HeadlessDialogOverlay
        className={cn(
          'fixed inset-0 z-[var(--z-overlay)]',
          backdropVariantClassName(backdrop, 'var(--dialog-overlay-bg)', blurIntensity),
          className,
        )}
        {...rest}
        ref={forwardedRef}
      />
    );
  },
);

DialogOverlay.displayName = 'DialogOverlay';

export { DialogOverlay };
export type { DialogOverlayProps };
