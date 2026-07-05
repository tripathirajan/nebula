/**
 * Type-guards `value` as an `HTMLElement`, safe to call in SSR contexts
 * where `HTMLElement` isn't defined on `globalThis`.
 *
 * @param value - Anything — a ref's `.current`, an event's `.target`, etc.
 * @returns Whether `value` is an `HTMLElement` (narrows the type when `true`).
 *
 * @example
 * ```ts
 * function focusIfElement(value: unknown) {
 *   if (isHTMLElement(value)) value.focus(); // value: HTMLElement here
 * }
 * ```
 */
function isHTMLElement(value: unknown): value is HTMLElement {
  return (
    typeof HTMLElement !== 'undefined' && value instanceof HTMLElement
  );
}

export { isHTMLElement };
