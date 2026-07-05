import type { RefObject } from 'react';
/**
 * Calls `handler` when a pointer-down event occurs outside every element in
 * `refs` — the basis for dismissing popovers/menus/dialogs on outside click.
 * Listens on `pointerdown` rather than `click` so it fires before a nested
 * element's own click handler and matches native dismiss-on-press behavior.
 *
 * @param refs - One ref, or an array of refs — an outside click must miss all of them to fire `handler` (e.g. a popover's trigger button *and* its content).
 * @param handler - Called with the triggering `PointerEvent`.
 * @param options.enabled - Set `false` to detach the listener without unmounting. @default true
 *
 * @example
 * ```tsx
 * function Popover({ onClose, children }: PopoverProps) {
 *   const contentRef = useRef<HTMLDivElement>(null);
 *   useClickOutside(contentRef, onClose);
 *   return <div ref={contentRef}>{children}</div>;
 * }
 * ```
 */
declare function useClickOutside(refs: RefObject<HTMLElement> | RefObject<HTMLElement>[], handler: (event: PointerEvent) => void, { enabled }?: {
    enabled?: boolean;
}): void;
export { useClickOutside };
//# sourceMappingURL=use-click-outside.d.ts.map