/**
 * Wraps React's built-in `useId` with an optional, human-readable prefix
 * (`useId('nebula-tooltip')` -> `"nebula-tooltip-:r0:"`) — handy for
 * debugging generated `id`/`aria-*` wiring in devtools without losing
 * React's SSR-safe hydration-matched id generation.
 *
 * @param prefix - Prepended to the generated id, e.g. `'nebula-tabs'`.
 * @returns A unique, SSR-safe id string.
 *
 * @example
 * ```tsx
 * const baseId = useId('nebula-tabs');
 * const triggerId = `${baseId}-trigger-account`;
 * ```
 */
declare function useId(prefix?: string): string;
export { useId };
//# sourceMappingURL=use-id.d.ts.map