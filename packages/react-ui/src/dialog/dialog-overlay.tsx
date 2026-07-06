import { cn } from '@nebula/primitives/cn';
import { DialogOverlay as StylelessDialogOverlay } from '@nebula/styleless/dialog';
import * as React from 'react';

import type { DialogOverlayProps as StylelessDialogOverlayProps } from '@nebula/styleless/dialog';

type DialogOverlayProps = StylelessDialogOverlayProps;

/** The dimmed backdrop — styled off `--dialog-overlay-bg` at low opacity (see `../tokens/component.ts`). */
const DialogOverlay = React.forwardRef<HTMLDivElement, DialogOverlayProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <StylelessDialogOverlay
        className={cn('fixed inset-0 z-50 bg-[var(--dialog-overlay-bg)]/50', className)}
        {...rest}
        ref={forwardedRef}
      />
    );
  },
);

DialogOverlay.displayName = 'DialogOverlay';

export { DialogOverlay };
export type { DialogOverlayProps };
