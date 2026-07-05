import { useEffect } from 'react';

let lockCount = 0;
let originalBodyOverflow: string | undefined;
let originalBodyPaddingRight: string | undefined;

/**
 * Locks `document.body` scrolling while `locked` is true — used by
 * modal/dialog/drawer overlays. Reference-counted across concurrent callers
 * so two overlays open at once don't fight over restoring the original
 * style, and compensates for the scrollbar-width layout shift by padding
 * `body` so page content doesn't jump when the scrollbar disappears.
 *
 * @param locked - Whether scrolling should currently be locked. @default true
 *
 * @example
 * ```tsx
 * function Dialog({ open, children }: DialogProps) {
 *   useScrollLock(open);
 *   if (!open) return null;
 *   return <Portal>{children}</Portal>;
 * }
 * ```
 */
function useScrollLock(locked = true): void {
  useEffect(() => {
    if (!locked || typeof document === 'undefined') return;

    if (lockCount === 0) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      originalBodyOverflow = document.body.style.overflow;
      originalBodyPaddingRight = document.body.style.paddingRight;
      document.body.style.overflow = 'hidden';
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
    }
    lockCount += 1;

    return () => {
      lockCount = Math.max(0, lockCount - 1);
      if (lockCount === 0) {
        document.body.style.overflow = originalBodyOverflow ?? '';
        document.body.style.paddingRight = originalBodyPaddingRight ?? '';
      }
    };
  }, [locked]);
}

export { useScrollLock };
