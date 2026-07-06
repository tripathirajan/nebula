import { cn } from '@nebula/primitives/cn';
import { Primitive } from '@nebula/primitives/primitive';
import * as React from 'react';

import { Avatar } from '../avatar/avatar';
import { AvatarFallback } from '../avatar/avatar-fallback';

import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';

interface AvatarGroupOwnProps {
  /** Show at most this many `Avatar` children, replacing the rest with a `+N` overflow indicator. Omit to show every child. */
  max?: number;
}

type AvatarGroupProps = PrimitivePropsWithRef<'div'> & AvatarGroupOwnProps;

/**
 * Overlaps a row of `Avatar`s (negative margin + a ring in the page
 * background color, so each avatar reads as a distinct circle rather than
 * abutting edges) — purely a layout wrapper, no shared state of its own;
 * `max` is the one behavior, truncating `children` and rendering a `+N`
 * `Avatar`-styled indicator for the rest via a plain `React.Children` slice
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
  const { className, max, children, ...rest } = props;
  const items = React.Children.toArray(children);
  const visible = max !== undefined ? items.slice(0, max) : items;
  const overflow = max !== undefined ? items.length - visible.length : 0;

  return (
    <Primitive
      as="div"
      className={cn('flex -space-x-3 [&>*]:ring-2 [&>*]:ring-[var(--avatar-group-ring)]', className)}
      {...rest}
      ref={forwardedRef}
    >
      {visible}
      {overflow > 0 ? (
        <Avatar>
          <AvatarFallback>+{overflow}</AvatarFallback>
        </Avatar>
      ) : null}
    </Primitive>
  );
});

AvatarGroup.displayName = 'AvatarGroup';

export { AvatarGroup };
export type { AvatarGroupProps };
