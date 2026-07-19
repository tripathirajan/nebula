import { useEffect, useRef } from 'react';

import type { RefObject } from 'react';

// `@nebula-lab/hooks` intentionally has no workspace dependencies (see
// component-library-architecture.md §2), so this duplicates the small
// focusable-element query that also lives in `@nebula-lab/utilities` rather than
// importing it. If that layering rule ever relaxes, collapse this into a
// shared import from `@nebula-lab/utilities/is-focusable`.
const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'iframe',
  'audio[controls]',
  'video[controls]',
  '[contenteditable]:not([contenteditable="false"])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

/**
 * `offsetParent === null` is *not* a reliable "is this hidden" check — it's
 * also null for `position: fixed` elements (the norm for floating dialogs/
 * popovers/tooltips) and, in jsdom, for literally every element regardless
 * of visibility, since jsdom never computes layout. Checking computed style
 * directly works in both real browsers and jsdom.
 */
function isElementVisible(element: HTMLElement): boolean {
  if (element.hidden) return false;
  const style = window.getComputedStyle(element);
  return style.display !== 'none' && style.visibility !== 'hidden';
}

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    isElementVisible,
  );
}

/**
 * Traps Tab/Shift+Tab focus cycling within `ref`'s subtree while `active` is
 * true, and restores focus to whatever was focused beforehand on cleanup —
 * the keyboard-behavior half of the WAI-ARIA Dialog (Modal) pattern. Note:
 * `@nebula-lab/primitives`' `FocusScope` component implements the equivalent
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
function useFocusTrap<T extends HTMLElement>(ref: RefObject<T>, active = true): void {
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active) return;
    const container = ref.current;
    if (!container) return;

    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;

    const focusables = getFocusableElements(container);
    (focusables[0] ?? container).focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      const currentFocusables = getFocusableElements(container);
      if (currentFocusables.length === 0) {
        event.preventDefault();
        return;
      }

      const first = currentFocusables[0]!;
      const last = currentFocusables[currentFocusables.length - 1]!;
      const activeElement = document.activeElement;

      if (event.shiftKey && activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    container.addEventListener('keydown', onKeyDown);

    return () => {
      container.removeEventListener('keydown', onKeyDown);
      previouslyFocusedRef.current?.focus();
    };
  }, [ref, active]);
}

export { useFocusTrap };
