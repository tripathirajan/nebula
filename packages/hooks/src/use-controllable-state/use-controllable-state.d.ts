import type { Dispatch, SetStateAction } from 'react';
interface UseControllableStateParams<T> {
    /**
     * The controlled value. Omit (or pass `undefined`) to stay uncontrolled —
     * once a defined value is passed here, the hook always reflects it and
     * calls `onChange` instead of managing its own internal state.
     */
    prop?: T;
    defaultProp?: T;
    onChange?: (value: T) => void;
}
/**
 * The single controlled/uncontrolled state pattern every stateful Nebula
 * primitive is built on (`Checkbox`, `Select`, `Tabs`, `Switch`, ...):
 * consumers can either pass `value`/`onValueChange` (controlled) or
 * `defaultValue` (uncontrolled, internally managed) — this hook picks the
 * right one and exposes a single `[value, setValue]` pair either way.
 *
 * @typeParam T - The value's type.
 * @param params.prop - The controlled value, if any.
 * @param params.defaultProp - The initial value when uncontrolled.
 * @param params.onChange - Called whenever the value changes, controlled or not.
 * @returns A `[value, setValue]` pair, same shape as `useState`.
 *
 * @example
 * ```tsx
 * function Tabs({ value: valueProp, defaultValue, onValueChange, children }: TabsProps) {
 *   const [value, setValue] = useControllableState({
 *     prop: valueProp,
 *     defaultProp: defaultValue,
 *     onChange: onValueChange,
 *   });
 *   // `value`/`setValue` work the same whether the consumer passed `value`
 *   // (controlled) or just `defaultValue` (uncontrolled).
 *   return <TabsProvider value={value} onValueChange={setValue}>{children}</TabsProvider>;
 * }
 * ```
 */
declare function useControllableState<T>({ prop, defaultProp, onChange, }: UseControllableStateParams<T>): [T, Dispatch<SetStateAction<T>>];
/**
 * Ref-based "was this ever controlled" check, useful for dev-mode warnings
 * about switching a component between controlled/uncontrolled mid-lifetime
 * (mirrors React's own `<input value>` warning).
 *
 * @param isControlled - Whether the component is currently controlled (typically `prop !== undefined`).
 * @param componentName - Named in the console warning.
 *
 * @example
 * ```tsx
 * useIsControlledWarning(props.value !== undefined, 'Tabs');
 * ```
 */
declare function useIsControlledWarning(isControlled: boolean, componentName: string): void;
export { useControllableState, useIsControlledWarning };
export type { UseControllableStateParams };
//# sourceMappingURL=use-controllable-state.d.ts.map