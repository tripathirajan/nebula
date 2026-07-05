import type { RefObject } from 'react';
/**
 * Traps Tab/Shift+Tab focus cycling within `ref`'s subtree while `active` is
 * true, and restores focus to whatever was focused beforehand on cleanup —
 * the keyboard-behavior half of the WAI-ARIA Dialog (Modal) pattern. Note:
 * `@nebula/primitives`' `FocusScope` component implements the equivalent
 * behavior itself rather than depending on this hook (see that package's
 * README on why `primitives` doesn't import from `hooks`) — reach for this
 * hook when you're not already using `FocusScope`/`Primitive`-based
 * components and just need the raw behavior.
 *
 * @typeParam T - The trapped container's element type.
 * @param ref - The container whose focusable descendants should be trapped.
 * @param active - Whether the trap is currently engaged. @default true
 *
 * @example
 * ```tsx
 * function CustomModal({ open, children }: { open: boolean; children: ReactNode }) {
 *   const ref = useRef<HTMLDivElement>(null);
 *   useFocusTrap(ref, open);
 *   if (!open) return null;
 *   return <div ref={ref}>{children}</div>;
 * }
 * ```
 */
declare function useFocusTrap<T extends HTMLElement>(ref: RefObject<T>, active?: boolean): void;
export { useFocusTrap };
//# sourceMappingURL=use-focus-trap.d.ts.map