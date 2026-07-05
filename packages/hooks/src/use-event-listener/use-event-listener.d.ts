import type { RefObject } from 'react';
type EventTargetLike = Window | Document | HTMLElement | EventTarget;
/**
 * Attaches `handler` for `eventName` on `target` (defaults to `window`) and
 * cleans it up automatically. `handler` is read from a ref internally, so
 * you don't need to memoize it or list it in any dependency array — only
 * `eventName`/`target`/`options` changes re-attach the listener.
 *
 * @typeParam K - The event name — narrows `handler`'s event type via `WindowEventMap`.
 * @param eventName - Any key of `WindowEventMap`, e.g. `'resize'`, `'keydown'`.
 * @param handler - Called with the typed event.
 * @param target - A ref, element, `window`/`document`, or `null`/omitted (defaults to `window`).
 * @param options - Standard `addEventListener` options/boolean.
 *
 * @example
 * ```tsx
 * useEventListener('keydown', (event) => {
 *   if (event.key === 'Escape') onClose();
 * });
 *
 * // Scoped to a specific element instead of window:
 * const ref = useRef<HTMLDivElement>(null);
 * useEventListener('scroll', onScroll, ref);
 * ```
 */
declare function useEventListener<K extends keyof WindowEventMap>(eventName: K, handler: (event: WindowEventMap[K]) => void, target?: RefObject<EventTargetLike> | EventTargetLike | null, options?: boolean | AddEventListenerOptions): void;
export { useEventListener };
//# sourceMappingURL=use-event-listener.d.ts.map