import * as React from 'react';

import { useComposedRefs } from '../compose-refs/compose-refs';
import { Primitive } from '../primitive/primitive';

import type { PrimitivePropsWithRef } from '../primitive/primitive';

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

interface FocusScopeProps extends PrimitivePropsWithRef<'div'> {
  /**
   * Trap Tab/Shift+Tab focus cycling within this scope's subtree — for
   * modal contexts (`Dialog`). Non-modal contexts (a `Popover` that
   * shouldn't block interacting with the rest of the page) should leave
   * this `false` and get auto-focus/focus-restore only.
   * @default false
   */
  trapped?: boolean;
  /** Called when the scope mounts and is about to move focus into itself; call `event.preventDefault()` to take over focusing yourself. */
  onMountAutoFocus?: (event: Event) => void;
  /** Called when the scope unmounts and is about to restore focus to whatever was focused before it mounted; call `event.preventDefault()` to take over. */
  onUnmountAutoFocus?: (event: Event) => void;
}

/**
 * Manages focus for a subtree: on mount, moves focus into itself (first
 * focusable descendant, or the container itself if none); on unmount,
 * restores focus to whatever was focused beforehand; while mounted, can
 * optionally trap Tab cycling within itself (`trapped`). This is the
 * focus-management half of the WAI-ARIA Dialog (Modal) pattern —
 * `Dialog`/`AlertDialog` compose this with `Portal` + `DismissibleLayer`.
 *
 * @example
 * ```tsx
 * function Modal({ open, onClose, children }: ModalProps) {
 *   if (!open) return null;
 *   return (
 *     <Portal>
 *       <FocusScope trapped onUnmountAutoFocus={(e) => e.preventDefault()}>
 *         {children}
 *       </FocusScope>
 *     </Portal>
 *   );
 * }
 * ```
 */
const FocusScope = React.forwardRef<HTMLDivElement, FocusScopeProps>((props, forwardedRef) => {
  const { trapped = false, onMountAutoFocus, onUnmountAutoFocus, ...scopeProps } = props;
  const containerRef = React.useRef<HTMLDivElement>(null);
  const composedRef = useComposedRefs(forwardedRef, containerRef);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;

    const mountEvent = new CustomEvent('nebulaFocusScopeMountAutoFocus', { cancelable: true });
    onMountAutoFocus?.(mountEvent);
    if (!mountEvent.defaultPrevented) {
      const [first] = getFocusableElements(container);
      if (first) {
        first.focus();
      } else {
        // Nothing currently matches the strict (Tab-reachable) selector —
        // this legitimately happens when the scope wraps a roving-tabindex
        // widget (`RovingFocusGroup`): every item renders `tabIndex={-1}`
        // until an item's own effect registers it as the "current tab
        // stop" (`tabIndex={0}`), and that effect isn't guaranteed to have
        // committed before this mount effect runs (both are triggered by
        // the same mount, and passive-effect ordering across sibling
        // subtrees doesn't guarantee the descendant's effect — even a
        // `useLayoutEffect` — has flushed its state update yet). A `-1`
        // item is still perfectly focusable via a direct `.focus()` call
        // (that's the whole point of `-1` vs. omitting `tabindex`
        // entirely), so fall back to the first descendant with *any*
        // tabindex, not just a Tab-reachable one.
        const fallback = container.querySelector<HTMLElement>(`${FOCUSABLE_SELECTOR}, [tabindex]`);
        (fallback ?? container).focus();
      }
    }

    return () => {
      const unmountEvent = new CustomEvent('nebulaFocusScopeUnmountAutoFocus', {
        cancelable: true,
      });
      onUnmountAutoFocus?.(unmountEvent);
      if (!unmountEvent.defaultPrevented) {
        // Only restore focus if nothing else has legitimately claimed it
        // since mount — i.e. focus is still somewhere inside this scope
        // (about to be orphaned by the unmount) or has already fallen back
        // to `document.body` (the browser's default when a focused element
        // is removed from the DOM). If focus is on some other specific
        // element, a real, deliberate focus change already happened after
        // this scope mounted — don't fight it. This matters once a scope's
        // unmount is delayed past the interaction that moved focus away
        // (e.g. `Presence` keeping this mounted through an exit animation):
        // without this check, a `Menubar` switching from one open menu to
        // a sibling via focus would have the closing menu's belated
        // unmount steal focus right back to its own trigger a moment
        // later, undoing the switch.
        const active = document.activeElement;
        const focusStillClaimable = active === document.body || container.contains(active);
        if (focusStillClaimable) {
          previouslyFocused?.focus();
        }
      }
    };
    // Mount/unmount effect only — intentionally not re-run on prop changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (!trapped) return;
    const container = containerRef.current;
    if (!container) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;
      const focusables = getFocusableElements(container);
      if (focusables.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusables[0]!;
      const last = focusables[focusables.length - 1]!;
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    container.addEventListener('keydown', onKeyDown);
    return () => container.removeEventListener('keydown', onKeyDown);
  }, [trapped]);

  return <Primitive as="div" tabIndex={-1} {...scopeProps} ref={composedRef} />;
});

FocusScope.displayName = 'FocusScope';

export { FocusScope };
export type { FocusScopeProps };
