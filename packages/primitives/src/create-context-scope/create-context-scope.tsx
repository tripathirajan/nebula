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
function createContext<ContextValueType extends object | null>(
  rootComponentName: string,
  defaultContext?: ContextValueType,
) {
  const Context = React.createContext<ContextValueType | undefined>(defaultContext);

  function Provider(props: ContextValueType & { children: React.ReactNode }) {
    const { children, ...context } = props;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const value = React.useMemo(() => context, Object.values(context)) as ContextValueType;
    return <Context.Provider value={value}>{children}</Context.Provider>;
  }

  function useContext(consumerName: string) {
    const context = React.useContext(Context);
    if (context) return context;
    if (defaultContext !== undefined) return defaultContext;
    throw new Error(`\`${consumerName}\` must be used within \`${rootComponentName}\``);
  }

  Provider.displayName = `${rootComponentName}Provider`;
  return [Provider, useContext] as const;
}

/**
 * A single component's slice of scoped context — an array of React contexts,
 * one per `createContext` call made against that component's scope.
 *
 * Defaults to `any` (not `unknown`) deliberately: an unparameterized `Scope`
 * (as used internally by `ScopeHook`/`CreateScope`, and by any component that
 * composes another's scope via `createContextScopeDeps` — e.g. Popover
 * composing Popper's scope) is a dict whose values are heterogeneous across
 * keys — one component's context-value type per `scopeName`. `unknown` would
 * force every call site passing a concretely-typed `Scope<X>` into that
 * position to satisfy `Context<unknown>[]`, which — because `React.Context`
 * isn't covariant in its value type — doesn't structurally hold even though
 * it's always safe in practice. `any` is the honest way to spell "don't
 * check this one dimension"; concrete call sites still get full checking via
 * their own explicit `Scope<ContextValueType>` annotations.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- see doc comment above: `unknown` doesn't structurally hold here even though it's always safe in practice.
type Scope<C = any> = { [scopeName: string]: React.Context<C>[] } | undefined;
type ScopeHook = (scope: Scope) => { [__scopeProp: string]: Scope };

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
function createContextScope(scopeName: string, createContextScopeDeps: CreateScope[] = []) {
  let defaultContexts: unknown[] = [];

  function createContext<ContextValueType extends object | null>(
    rootComponentName: string,
    defaultContext?: ContextValueType,
  ) {
    const BaseContext = React.createContext<ContextValueType | undefined>(defaultContext);
    const index = defaultContexts.length;
    defaultContexts = [...defaultContexts, defaultContext];

    function Provider(
      props: ContextValueType & { scope: Scope<ContextValueType>; children: React.ReactNode },
    ) {
      const { scope, children, ...context } = props;
      const Context = scope?.[scopeName]?.[index] ?? (BaseContext as never);
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const value = React.useMemo(() => context, Object.values(context)) as ContextValueType;
      return <Context.Provider value={value}>{children}</Context.Provider>;
    }

    function useContext(consumerName: string, scope: Scope<ContextValueType>) {
      const Context = scope?.[scopeName]?.[index] ?? (BaseContext as never);
      const context = React.useContext(Context);
      if (context) return context;
      if (defaultContext !== undefined) return defaultContext;
      throw new Error(`\`${consumerName}\` must be used within \`${rootComponentName}\``);
    }

    Provider.displayName = `${rootComponentName}Provider`;
    return [Provider, useContext] as const;
  }

  const createScope: CreateScope = () => {
    const scopeContexts = defaultContexts.map((defaultContext) => {
      return React.createContext(defaultContext);
    });

    return function useScope(scope: Scope) {
      const contexts = scope?.[scopeName] ?? scopeContexts;
      return React.useMemo(
        () => ({ [`__scope${scopeName}`]: { ...scope, [scopeName]: contexts } }),
         
        [scope, contexts],
      );
    };
  };

  createScope.scopeName = scopeName;
  return [createContext, composeContextScopes(createScope, ...createContextScopeDeps)] as const;
}

/**
 * Merges N `createScope` factories into one, so a component built on top of
 * several scoped dependencies (e.g. `AccordionItem` using both its own scope
 * and `Collapsible`'s) can expose a single combined `useScope` to consumers.
 *
 * `baseScope` is a required, separate first parameter (rather than folded
 * into `...restScopes`) so its type stays non-optional — every call site
 * here always has at least one scope, but `scopes[0]` on a rest array
 * can't express that under `noUncheckedIndexedAccess`.
 */
function composeContextScopes(baseScope: CreateScope, ...restScopes: CreateScope[]) {
  if (restScopes.length === 0) return baseScope;
  const scopes = [baseScope, ...restScopes];

  const createScope: CreateScope = () => {
    const scopeHooks = scopes.map((createScope) => ({
      useScope: createScope(),
      scopeName: createScope.scopeName,
    }));

    return function useComposedScopes(overrideScopes) {
      const nextScopes = scopeHooks.reduce((nextScopes, { useScope, scopeName }) => {
        // We are calling a hook inside a callback which React warns against
        // (correctly), but this is intentional: every `useScope` here is
        // guaranteed to be the same hook across renders (module-level).
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const scopeProps = useScope(overrideScopes);
        const currentScope = scopeProps[`__scope${scopeName}`];
        return { ...nextScopes, ...currentScope };
      }, {} as Scope);

      return React.useMemo(() => ({ [`__scope${baseScope.scopeName}`]: nextScopes }), [nextScopes]);
    };
  };

  createScope.scopeName = baseScope.scopeName;
  return createScope;
}

export { createContextScope, createContext };
export type { CreateScope, Scope };
