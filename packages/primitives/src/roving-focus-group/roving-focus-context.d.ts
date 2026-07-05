import type { Scope } from '../create-context-scope/create-context-scope';
type Orientation = 'horizontal' | 'vertical';
interface RovingFocusGroupContextValue {
    orientation: Orientation;
    loop: boolean;
    currentTabStopId: string | null;
    onItemFocus: (id: string) => void;
    onItemShiftTab: () => void;
    getItems: () => Array<{
        id: string;
        node: HTMLElement;
    }>;
    /** Registers an item's DOM node under `id`; returns an unregister cleanup. */
    registerItem: (id: string, node: HTMLElement) => () => void;
}
declare const ROVING_FOCUS_GROUP_NAME = "RovingFocusGroup";
declare const createRovingFocusGroupScope: import("../create-context-scope").CreateScope;
declare const RovingFocusGroupProvider: {
    (props: RovingFocusGroupContextValue & {
        scope: Scope<RovingFocusGroupContextValue>;
        children: React.ReactNode;
    }): import("react").JSX.Element;
    displayName: string;
}, useRovingFocusGroupContext: (consumerName: string, scope: Scope<RovingFocusGroupContextValue>) => RovingFocusGroupContextValue;
/** Every `RovingFocusGroup`/`FocusItem` prop object accepts an internal `__scopeRovingFocusGroup`, threaded through by `createRovingFocusGroupScope`. */
type ScopedProps<P> = P & {
    __scopeRovingFocusGroup?: Scope<RovingFocusGroupContextValue>;
};
export { ROVING_FOCUS_GROUP_NAME, RovingFocusGroupProvider, useRovingFocusGroupContext, createRovingFocusGroupScope, };
export type { RovingFocusGroupContextValue, Orientation, ScopedProps };
//# sourceMappingURL=roving-focus-context.d.ts.map