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
declare function useScrollLock(locked?: boolean): void;
export { useScrollLock };
//# sourceMappingURL=use-scroll-lock.d.ts.map