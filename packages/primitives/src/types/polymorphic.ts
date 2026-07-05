import type * as React from 'react';

/**
 * The correct `ref` type for whatever element/component `E` currently is —
 * resolves through `React.ComponentPropsWithRef`, so it stays accurate when
 * `E` changes (e.g. `'button'` -> `HTMLButtonElement`, `typeof Link` ->
 * whatever `Link` forwards its ref to).
 *
 * @typeParam E - The element type (intrinsic tag name or component) currently rendered.
 */
type PolymorphicRef<E extends React.ElementType> = React.ComponentPropsWithRef<E>['ref'];

/**
 * The two props every Nebula polymorphic component accepts on top of its own
 * props: `as` (swap the rendered tag/component) and `asChild` (merge props
 * onto a single child via `Slot` instead of rendering an element of your
 * own — see `Slot`). `asChild` takes precedence over `as` when both are set.
 *
 * @typeParam E - The element type `as` is currently set to (defaults flow in from the component's default type param).
 * @typeParam P - The component's own props, before the polymorphic/DOM props are mixed in.
 *
 * @example
 * ```tsx
 * // `as` swaps the tag:
 * <Text as="label" htmlFor="email">Email</Text>
 *
 * // `asChild` merges Text's props onto the anchor instead of rendering its own tag:
 * <Text asChild>
 *   <a href="/pricing">See pricing</a>
 * </Text>
 * ```
 */
type PolymorphicProps<E extends React.ElementType, P = object> = P & {
  as?: E;
  asChild?: boolean;
};

/**
 * `PolymorphicProps` merged with `E`'s own DOM/component props (minus
 * whatever `P` already declares, so a component can override a prop's type —
 * e.g. narrowing `onValueChange` — without a duplicate-property error).
 *
 * @typeParam E - The element type `as` is currently set to.
 * @typeParam P - The component's own props.
 */
type PolymorphicComponentProps<E extends React.ElementType, P = object> = PolymorphicProps<E, P> &
  Omit<React.ComponentPropsWithoutRef<E>, keyof PolymorphicProps<E, P>>;

/**
 * `PolymorphicComponentProps` plus a correctly-typed `ref` for the current
 * `E` — this is the prop type every polymorphic Nebula component (`Box`,
 * `Text`, `Button`, ...) declares its props as.
 *
 * @typeParam E - The element type `as` is currently set to.
 * @typeParam P - The component's own props.
 *
 * @example
 * ```tsx
 * interface TextOwnProps {
 *   truncate?: boolean;
 * }
 *
 * type TextProps<E extends React.ElementType = 'span'> = PolymorphicComponentPropsWithRef<
 *   E,
 *   TextOwnProps
 * >;
 * ```
 */
type PolymorphicComponentPropsWithRef<E extends React.ElementType, P = object> = PolymorphicComponentProps<
  E,
  P
> & {
  ref?: PolymorphicRef<E>;
};

/**
 * The type every polymorphic Nebula component is cast to after
 * `React.forwardRef(...)`. `forwardRef`'s return type can't itself be
 * generic (`ForwardRefExoticComponent` has no type parameter for `E`), so
 * every such component casts its `forwardRef` result to a plain call
 * signature generic over `E` — this type is that call signature, plus the
 * `displayName` property TypeScript won't let you assign to a bare function
 * type under `strict` mode.
 *
 * @typeParam Default - The element type `E` defaults to when `as` is omitted.
 * @typeParam P - The component's own props (same `P` passed to `PolymorphicComponentPropsWithRef`).
 */
type PolymorphicComponent<Default extends React.ElementType, P = object> = {
  <E extends React.ElementType = Default>(
    props: PolymorphicComponentPropsWithRef<E, P>,
  ): React.ReactElement | null;
  displayName?: string;
};

export type {
  PolymorphicRef,
  PolymorphicProps,
  PolymorphicComponentProps,
  PolymorphicComponentPropsWithRef,
  PolymorphicComponent,
};
