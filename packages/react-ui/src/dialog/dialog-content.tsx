import { DialogContent as HeadlessDialogContent } from '@nebula-lab/headless/dialog';
import { cn } from '@nebula-lab/primitives/cn';
import * as React from 'react';

import { DialogClose } from './dialog-close';

import type { DialogContentProps as HeadlessDialogContentProps } from '@nebula-lab/headless/dialog';

interface DialogContentOwnProps {
  /** Hide the built-in top-right close icon (e.g. for a dialog that only closes via an explicit in-body action). @default false */
  hideCloseButton?: boolean;
}

type DialogContentProps = HeadlessDialogContentProps & DialogContentOwnProps;

/**
 * Fixed, centered card — styled off `--dialog-content-bg`/`-border`/`-text`
 * (see `../tokens/component.ts`). Renders a built-in icon `DialogClose` in
 * the top-right corner by default (the common expectation for a dismissible
 * dialog); pass `hideCloseButton` to omit it for a dialog that should only
 * close via an explicit action.
 *
 * Fades/scales in on open and out on close via `data-[state]` (same
 * `--motion-duration-base`/`--motion-ease-out` treatment every overlay
 * content component in this repo now shares — see `PopoverContent`'s own
 * doc comment for why) — the headless `Dialog` root already composes
 * `Presence`, so this stays mounted for the transition's duration instead
 * of unmounting immediately on close. Shadow reads `--elevation-modal`
 * (the heavier of this repo's two overlay elevation tiers, for surfaces
 * that take over the interaction rather than follow a trigger).
 *
 * @example
 * ```tsx
 * <DialogContent>
 *   <DialogTitle>Delete item?</DialogTitle>
 *   <DialogDescription>This can't be undone.</DialogDescription>
 * </DialogContent>
 * ```
 */
const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  (props, forwardedRef) => {
    const { className, children, hideCloseButton = false, ...rest } = props;
    return (
      <HeadlessDialogContent
        className={cn(
          'fixed left-1/2 top-1/2 z-[var(--z-overlay)] w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-[var(--radius-dialog)] border border-[var(--dialog-content-border)] bg-[var(--dialog-content-bg)] p-6 text-[var(--dialog-text)] shadow-[var(--elevation-modal)] transition-[opacity,transform] duration-[var(--motion-duration-base)] ease-[var(--motion-ease-out)] focus-visible:outline-none data-[state=closed]:scale-95 data-[state=closed]:opacity-0 data-[state=open]:scale-100 data-[state=open]:opacity-100',
          className,
        )}
        {...rest}
        ref={forwardedRef}
      >
        {children}
        {!hideCloseButton && (
          <DialogClose
            aria-label="Close"
            className="absolute right-4 top-4 rounded-[var(--radius-selector)] p-1 text-[var(--dialog-text)]/60 hover:text-[var(--dialog-text)]"
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
          </DialogClose>
        )}
      </HeadlessDialogContent>
    );
  },
);

DialogContent.displayName = 'DialogContent';

export { DialogContent };
export type { DialogContentProps };
