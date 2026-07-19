import { cn } from '@nebula-lab/primitives/cn';
import { AvatarGroup as StylelessAvatarGroup } from '@nebula-lab/styleless/avatar-group';
import * as React from 'react';

import { Avatar } from '../avatar/avatar';
import { AvatarFallback } from '../avatar/avatar-fallback';

import type { AvatarGroupProps as StylelessAvatarGroupProps } from '@nebula-lab/styleless/avatar-group';

type AvatarGroupProps = StylelessAvatarGroupProps;

/**
 * Styled wrapper around `@nebula-lab/styleless`'s `AvatarGroup` — the `max`
 * truncation math comes from there unchanged. This layer adds the overlap
 * treatment (negative margin + a ring in the page background color, so each
 * avatar reads as a distinct circle rather than abutting edges) and supplies
 * `renderOverflow` with this package's own styled `Avatar`/`AvatarFallback`
 * so the `+N` badge matches the rest of the row instead of styleless's
 * unstyled default.
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
  const { className, renderOverflow, ...rest } = props;
  return (
    <StylelessAvatarGroup
      className={cn('flex -space-x-3 [&>*]:ring-2 [&>*]:ring-[var(--avatar-group-ring)]', className)}
      renderOverflow={
        renderOverflow ??
        ((count) => (
          <Avatar>
            <AvatarFallback>+{count}</AvatarFallback>
          </Avatar>
        ))
      }
      {...rest}
      ref={forwardedRef}
    />
  );
});

AvatarGroup.displayName = 'AvatarGroup';

export { AvatarGroup };
export type { AvatarGroupProps };
