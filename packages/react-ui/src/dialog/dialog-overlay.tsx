import { DialogOverlay as HeadlessDialogOverlay } from '@nebula/headless/dialog';
import { cn } from '@nebula/primitives/cn';
import * as React from 'react';

import type { DialogOverlayProps as HeadlessDialogOverlayProps } from '@nebula/headless/dialog';

type DialogOverlayProps = HeadlessDialogOverlayProps;

/** The dimmed backdrop — styled off `--dialog-overlay-bg` at low opacity (see `../tokens/component.ts`). */
const DialogOverlay = React.forwardRef<HTMLDivElement, DialogOverlayProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <HeadlessDialogOverlay
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
