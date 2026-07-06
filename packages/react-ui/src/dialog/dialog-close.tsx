import { cn } from '@nebula/primitives/cn';
import { DialogClose as StylelessDialogClose } from '@nebula/styleless/dialog';
import * as React from 'react';

import type { DialogCloseProps as StylelessDialogCloseProps } from '@nebula/styleless/dialog';

type DialogCloseProps = StylelessDialogCloseProps;

/**
 * Unopinionated beyond a focus ring — used both as `DialogContent`'s
 * built-in icon close button (see `dialog-content.tsx`) and as a plain text
 * button a consumer drops into the body/footer (e.g. `<DialogClose>Cancel</DialogClose>`),
 * which look nothing alike, so this doesn't bake in a specific appearance.
 */
const DialogClose = React.forwardRef<HTMLButtonElement, DialogCloseProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <StylelessDialogClose
        className={cn(
          'rounded-[var(--radius-selector)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dialog-text)] focus-visible:ring-offset-1',
          className,
        )}
        {...rest}
        ref={forwardedRef}
      />
    );
  },
);

DialogClose.displayName = 'DialogClose';

export { DialogClose };
export type { DialogCloseProps };
