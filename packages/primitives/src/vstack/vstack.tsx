
import * as React from 'react';

import { Stack } from '../stack/stack';

import type { StackOwnProps, StackProps } from '../stack/stack';
import type { PolymorphicComponent } from '../types/polymorphic';


/** Props accepted by {@link VStack} — identical to {@link Stack}'s. */
type VStackProps<E extends React.ElementType = 'div'> = StackProps<E>;

/**
 * Alias of `Stack` under the name some consumers reach for first coming
 * from other component libraries (Chakra UI's `VStack`, notably) — a thin
 * pass-through wrapper rather than `const VStack = Stack` directly, so it
 * gets its own `displayName` in devtools instead of mutating `Stack`'s
 * (they're the same rendered output either way; there's no behavior to
 * keep in sync between two implementations because there's only one).
 *
 * @example
 * ```tsx
 * <VStack gap={8}>
 *   <Label>Email</Label>
 *   <Input type="email" />
 * </VStack>
 * ```
 */
const VStack = React.forwardRef(
  <E extends React.ElementType = 'div'>(
    props: VStackProps<E>,
    forwardedRef: React.Ref<unknown>,
  ) => {
    return <Stack {...(props as StackProps<E>)} ref={forwardedRef} />;
  },
) as PolymorphicComponent<'div', StackOwnProps>;

VStack.displayName = 'VStack';

export { VStack };
export type { VStackProps };
