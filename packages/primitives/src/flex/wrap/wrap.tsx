
import * as React from 'react';

import { Inline } from '../inline/inline';

import type { PolymorphicComponent } from '../../types/polymorphic';
import type { InlineOwnProps, InlineProps } from '../inline/inline';


/** Props accepted by {@link Wrap} — identical to {@link Inline}'s. */
type WrapProps<E extends React.ElementType = 'div'> = InlineProps<E>;

/**
 * Alias of `Inline` under a name some consumers reach for first coming
 * from other component libraries — `Inline` already *is* "a wrapping row of
 * children," so this is a thin pass-through wrapper (own `displayName`,
 * same behavior) rather than a second implementation to keep in sync.
 *
 * @example
 * ```tsx
 * <Wrap gap={8}>
 *   <Badge>React</Badge>
 *   <Badge>TypeScript</Badge>
 *   <Badge>Tailwind</Badge>
 * </Wrap>
 * ```
 */
const Wrap = React.forwardRef(
  <E extends React.ElementType = 'div'>(props: WrapProps<E>, forwardedRef: React.Ref<unknown>) => {
    return <Inline {...(props as InlineProps<E>)} ref={forwardedRef} />;
  },
) as PolymorphicComponent<'div', InlineOwnProps>;

Wrap.displayName = 'Wrap';

export { Wrap };
export type { WrapProps };
