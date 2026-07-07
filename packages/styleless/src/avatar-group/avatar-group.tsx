import { Primitive } from '@nebula/primitives/primitive';
import * as React from 'react';

import { Avatar } from '../avatar/avatar';
import { AvatarFallback } from '../avatar/avatar-fallback';

import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';

interface AvatarGroupOwnProps {
  /** Show at most this many `Avatar` children, replacing the rest with a `+N` overflow indicator. Omit to show every child. */
  max?: number;
  /**
   * Renders the overflow indicator for the `N` truncated children — defaults
   * to an unstyled `Avatar`/`AvatarFallback` pair. Override this to supply a
   * themed overflow badge (e.g. `@nebula/react-ui`'s styled `Avatar`)
   * instead of this package's unstyled one — same render-prop escape hatch
   * `PasswordInput`'s `renderToggle` already uses, so the one real behavior
   * here (truncation) stays decoupled from what the overflow badge looks
   * like.
   */
  renderOverflow?: (count: number) => React.ReactNode;
}

type AvatarGroupProps = PrimitivePropsWithRef<'div'> & AvatarGroupOwnProps;

/**
 * A row of `Avatar`s with overflow truncation — unstyled (no overlap/ring
 * treatment; `@nebula/react-ui`'s `AvatarGroup` adds that). `max` is the one
 * real behavior worth decoupling here: truncating `children` and rendering
 * an overflow indicator for the rest via a plain `React.Children` slice
 * rather than a registration system, since a static list of `Avatar`
 * children needs nothing fancier.
 *
 * @example
 * ```tsx
 * <AvatarGroup max={3}>
 *   <Avatar><AvatarImage src="/1.jpg" alt="Ada" /></Avatar>
 *   <Avatar><AvatarImage src="/2.jpg" alt="Grace" /></Avatar>
 *   <Avatar><AvatarImage src="/3.jpg" alt="Alan" /></Avatar>
 *   <Avatar><AvatarImage src="/4.jpg" alt="Katherine" /></Avatar>
 * </AvatarGroup>
 * ```
 */
const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>((props, forwardedRef) => {
  const { max, renderOverflow, children, ...rest } = props;
  const items = React.Children.toArray(children);
  const visible = max !== undefined ? items.slice(0, max) : items;
  const overflow = max !== undefined ? items.length - visible.length : 0;

  return (
    <Primitive as="div" {...rest} ref={forwardedRef}>
      {visible}
      {overflow > 0
        ? (renderOverflow ?? defaultRenderOverflow)(overflow)
        : null}
    </Primitive>
  );
});

function defaultRenderOverflow(count: number): React.ReactNode {
  return (
    <Avatar>
      <AvatarFallback>+{count}</AvatarFallback>
    </Avatar>
  );
}

AvatarGroup.displayName = 'AvatarGroup';

export { AvatarGroup };
export type { AvatarGroupProps };
