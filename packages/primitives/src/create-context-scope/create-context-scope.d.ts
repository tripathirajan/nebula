import * as React from 'react';
/**
 * `createContext` — a thin wrapper over React context that throws a helpful
 * error (naming the required ancestor) instead of returning `undefined` when
 * a consumer is rendered outside its provider.
 *
 * @typeParam ContextValueType - The shape of the context value.
 * @param rootComponentName - The component name to name in the "must be used within" error, e.g. `'Accordion'`.
 * @param defaultContext - Returned instead of throwing when there's no provider — omit to make the provider required.
 * @returns A `[Provider, useContext]` tuple.
 *
 * @example
 * ```tsx
 * interface ToggleContextValue {
 *   pressed: boolean;
 *   onPressedChange: (pressed: boolean) => void;
 * }
 *
 * const [ToggleProvider, useToggleContext] = createContext<ToggleContextValue>('Toggle');
 *
 * // In the root component:
 * <ToggleProvider pressed={pressed} onPressedChange={setPressed}>{children}</ToggleProvider>;
 *
 * // In any descendant:
 * const { pressed } = useToggleContext('ToggleIndicator');
 * ```
 */
declare function createContext<ContextValueType extends object | null>(rootComponentName: string, defaultContext?: ContextValueType): readonly [{
    (props: ContextValueType & {
        children: React.ReactNode;
    }): React.JSX.Element;
    displayName: string;
}, (consumerName: string) => ContextValueType];
/**
 * A single component's slice of scoped context — an array of React contexts,
 * one per `createContext` call made against that component's scope.
 */
type Scope<C = unknown> = {
    [scopeName: string]: React.Context<C>[];
} | undefined;
type ScopeHook = (scope: Scope) => {
    [__scopeProp: string]: Scope;
};
interface CreateScope {
    scopeName: string;
    (): ScopeHook;
}
/**
 * `createContextScope` solves the "nested instances of the same compound
 * component" problem — e.g. a `Tabs` inside another `Tabs` — by letting each
 * root instance mint its own set of contexts instead of every instance
 * sharing one module-level context. Composite components (Accordion built on
 * Collapsible, etc.) compose their dependency's scope via `createScope` deps.
 *
 * @param scopeName - A unique name for this scope, e.g. `'Tabs'` — used as the key under which scoped contexts are stored.
 * @param createContextScopeDeps - `createScope` factories from lower-level components this one is built on (e.g. `Accordion` built on `Collapsible` passes `[createCollapsibleScope]`), so a single `scope` prop threads through every layer.
 * @returns A `[createContext, createScope]` tuple — `createContext` behaves like the module-level {@link createContext} above but is scope-aware; `createScope` is exported by the component (e.g. as `createTabsScope`) for other components to depend on.
 *
 * @example
 * ```tsx
 * const [createTabsContext, createTabsScope] = createContextScope('Tabs');
 * const [TabsProvider, useTabsContext] = createTabsContext<TabsContextValue>('Tabs');
 *
 * // Root component accepts an internal __scopeTabs prop and passes it to the provider:
 * <TabsProvider scope={__scopeTabs} value={value} onValueChange={setValue}>
 *   {children}
 * </TabsProvider>;
 *
 * // Nested `Tabs` inside another `Tabs` each get their own context instance
 * // instead of the inner one accidentally reading the outer one's state.
 * ```
 */
declare function createContextScope(scopeName: string, createContextScopeDeps?: CreateScope[]): readonly [<ContextValueType extends object | null>(rootComponentName: string, defaultContext?: ContextValueType) => readonly [{
    (props: ContextValueType & {
        scope: Scope<ContextValueType>;
        children: React.ReactNode;
    }): React.JSX.Element;
    displayName: string;
}, (consumerName: string, scope: Scope<ContextValueType>) => ContextValueType], CreateScope];
export { createContextScope, createContext };
export type { CreateScope, Scope };
//# sourceMappingURL=create-context-scope.d.ts.map