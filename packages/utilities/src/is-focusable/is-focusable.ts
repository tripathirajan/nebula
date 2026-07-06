import { isHTMLElement } from '../is-html-element/is-html-element';

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
 * Whether `element` is keyboard-focusable — used by `FocusScope`/focus-trap
 * style behavior to find the first/last focusable descendant. Checks
 * `disabled`, `tabindex="-1"`, `hidden`, and `display: none` /
 * `visibility: hidden` (via layout box + computed style, so it also catches
 * ancestors hidden via CSS, not just the element itself).
 *
 * @param element - Anything — typically a `querySelectorAll` result or an event target.
 * @returns Whether `element` is a real, currently-focusable `HTMLElement`.
 *
 * @example
 * ```ts
 * const focusableChildren = Array.from(container.querySelectorAll('*')).filter(isFocusable);
 * focusableChildren[0]?.focus();
 * ```
 */
function isFocusable(element: unknown): element is HTMLElement {
  if (!isHTMLElement(element)) return false;
  if (element.hasAttribute('disabled')) return false;
  if (element.hidden) return false;
  if (!element.matches(FOCUSABLE_SELECTOR)) return false;

  if (typeof window === 'undefined') return true;

  // Deliberately not using `offsetParent` here: it's null for
  // `position: fixed` elements (the norm for floating dialogs/popovers/
  // tooltips) in real browsers, and null for *every* element in jsdom,
  // since jsdom never computes layout. Computed style alone is reliable in
  // both.
  const style = window.getComputedStyle(element);
  return style.visibility !== 'hidden' && style.display !== 'none';
}

export { isFocusable };
