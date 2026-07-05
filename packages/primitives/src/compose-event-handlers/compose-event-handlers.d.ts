/**
 * Merges a consumer-provided event handler with an internal one, so
 * components can attach their own behavior without clobbering a user's
 * `onClick`/`onKeyDown`/etc. If the consumer calls `event.preventDefault()`,
 * the internal handler is skipped by default (matches native DOM semantics).
 *
 * @param originalEventHandler - The consumer's handler (e.g. the `onClick` a caller passed in). Always runs first.
 * @param ourEventHandler - The component's own internal handler. Skipped if `originalEventHandler` called `preventDefault()`, unless `checkForDefaultPrevented` is `false`.
 * @param options.checkForDefaultPrevented - Set `false` to always run `ourEventHandler` regardless of `preventDefault()`. @default true
 * @returns A single event handler to pass to the DOM element.
 *
 * @example
 * ```tsx
 * <button
 *   {...props}
 *   onClick={composeEventHandlers(props.onClick, () => {
 *     // internal side effect, e.g. selecting this tab
 *   })}
 * />
 * ```
 */
declare function composeEventHandlers<E extends {
    defaultPrevented: boolean;
}>(originalEventHandler?: (event: E) => void, ourEventHandler?: (event: E) => void, { checkForDefaultPrevented }?: {
    checkForDefaultPrevented?: boolean;
}): (event: E) => void;
export { composeEventHandlers };
//# sourceMappingURL=compose-event-handlers.d.ts.map