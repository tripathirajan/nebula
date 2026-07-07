import { Primitive } from '@nebula/primitives/primitive';
import * as React from 'react';

import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';

const TOAST_ACTION_NAME = 'ToastAction';

interface ToastActionProps extends PrimitivePropsWithRef<'button'> {
  /**
   * Required, separately from this button's visible text/children. A
   * toast's live-region announcement can be interrupted or missed
   * entirely (that's the nature of `aria-live="polite"`), so if a user
   * *does* land on this button later via Tab, `altText` is what a screen
   * reader announces to explain what it does *without* the surrounding
   * toast context that a sighted user has — e.g. `altText="Undo the
   * upload"` for a bare "Undo" button.
   */
  altText: string;
}

/**
 * A toast's action button, e.g. "Undo". No dismissal behavior of its own —
 * wire `onOpenChange(false)` (or use `ToastClose`) explicitly if the action
 * should also dismiss the toast; often you want the toast to stay open
 * briefly to confirm the action succeeded instead.
 *
 * @example
 * ```tsx
 * <ToastAction altText="Undo the upload" onClick={undo}>Undo</ToastAction>
 * ```
 */
const ToastAction = React.forwardRef<HTMLButtonElement, ToastActionProps>(
  (props, forwardedRef) => {
    const { altText, ...actionProps } = props;

    return (
      <Primitive
        as="button"
        type="button"
        aria-label={altText}
        {...actionProps}
        ref={forwardedRef}
      />
    );
  },
);

ToastAction.displayName = TOAST_ACTION_NAME;

export { ToastAction };
export type { ToastActionProps };
