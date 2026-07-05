interface UseBooleanActions {
    setTrue: () => void;
    setFalse: () => void;
    toggle: () => void;
    set: (value: boolean) => void;
}
/**
 * Boolean state with named setters instead of a raw `setState` — reads
 * better at call sites (`open.setTrue()` vs `setOpen(true)`) and the actions
 * object has a stable identity across renders.
 *
 * @param initialValue - The initial boolean value. @default false
 * @returns A `[value, actions]` pair — `actions` has a stable identity, safe to destructure and pass to child components without causing re-renders.
 *
 * @example
 * ```tsx
 * function Disclosure() {
 *   const [expanded, { toggle, setFalse }] = useBoolean(false);
 *   return (
 *     <>
 *       <button onClick={toggle}>{expanded ? 'Collapse' : 'Expand'}</button>
 *       {expanded && <button onClick={setFalse}>Close</button>}
 *     </>
 *   );
 * }
 * ```
 */
declare function useBoolean(initialValue?: boolean): [boolean, UseBooleanActions];
export { useBoolean };
export type { UseBooleanActions };
//# sourceMappingURL=use-boolean.d.ts.map