import * as React from 'react';
import type { PolymorphicComponent, PolymorphicComponentPropsWithRef } from '../types/polymorphic';
/**
 * `ComponentPropsWithRef<E> & { asChild?: boolean }` for a component that
 * always renders a *fixed* tag `E` and only ever needs `asChild` (never
 * `as`) — most ARIA-pattern components (`Tab`, `DialogTrigger`, ...) want
 * this rather than full polymorphism, since swapping their tag arbitrarily
 * would break the ARIA role they're built around. Genuinely polymorphic
 * components (`Box`, `Text`, `Primitive` itself) should use
 * `PolymorphicComponentPropsWithRef` from `../types/polymorphic` instead.
 *
 * @typeParam E - The fixed intrinsic tag or component type this component renders.
 */
type PrimitivePropsWithRef<E extends React.ElementType> = React.ComponentPropsWithRef<E> & {
    asChild?: boolean;
};
/** Props accepted by {@link Primitive}. `E` defaults to `'div'` when `as` is omitted. */
type PrimitiveProps<E extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<E>;
/**
 * Implementation note (applies to every polymorphic component in this
 * package — `Box`, `Flex`, `Text`, etc. all repeat this same shape):
 * `React.forwardRef`'s type signature is `forwardRef<T, P>(render: (props: P,
 * ref: Ref<T>) => ...)`, which can't express "T depends on P's own `E` type
 * parameter." Two escape hatches make this work anyway:
 * 1. The render function's `ref` param is typed `Ref<unknown>` — `unknown`
 *    is a valid substitute for any `T` here because `RefCallback<unknown>`
 *    safely accepts being called with any concrete element (a function
 *    that only promises to look at its argument as `unknown` can't misuse a
 *    more specific value), so this stays sound from the inside.
 * 2. The whole `forwardRef(...)` result is cast to an explicitly generic
 *    function type, since `ForwardRefExoticComponent` itself can't be
 *    generic — this cast is what gives *consumers* (not this file) the
 *    precise `props`/`ref` types for whatever `E` they pass.
 * The polymorphic base every Nebula component is built on. Renders as `as`
 * (or `'div'` if omitted); pass `asChild` to instead merge these props onto
 * a single child element via {@link Slot} — `asChild` wins if both are set.
 *
 * There's deliberately no hardcoded list of supported tags: `as` accepts any
 * intrinsic JSX tag name or component type, and TypeScript infers the
 * correct prop/ref shape for whatever you pass.
 *
 * @example
 * ```tsx
 * // Defaults to a div:
 * <Primitive className="p-4">Card content</Primitive>
 *
 * // `as` swaps the rendered tag — props/ref type-check against it:
 * <Primitive as="button" onClick={() => {}}>Click me</Primitive>
 * <Primitive as="a" href="/pricing">See pricing</Primitive>
 *
 * // `as` also accepts a component, not just an intrinsic tag:
 * <Primitive as={NextLink} href="/dashboard">Dashboard</Primitive>
 *
 * // `asChild` merges onto the single child instead of rendering its own tag:
 * <Primitive asChild className="inline-flex items-center gap-2">
 *   <a href="/pricing">See pricing</a>
 * </Primitive>
 * ```
 */
declare const Primitive: PolymorphicComponent<"div">;
export { Primitive };
export type { PrimitiveProps, PrimitivePropsWithRef };
//# sourceMappingURL=primitive.d.ts.map