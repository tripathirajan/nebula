import { cn } from '@nebula/primitives/cn';
import { Avatar as StylelessAvatar } from '@nebula/styleless/avatar';
import * as React from 'react';

import type { AvatarProps as StylelessAvatarProps } from '@nebula/styleless/avatar';

type AvatarProps = StylelessAvatarProps;

/**
 * Styled wrapper around `@nebula/styleless`'s `Avatar` — the image
 * load/error tracking that lets `AvatarFallback` know when to render comes
 * from there unchanged (moved down this session, since it's reusable
 * non-visual state with no styling opinion, same bucket `PasswordInput`'s
 * visibility toggle already lives in). This layer only adds the circular
 * frame (`--avatar-bg`/`-text`, fixed 40px size, `overflow-hidden`).
 *
 * @example
 * ```tsx
 * <Avatar>
 *   <AvatarImage src="/users/42.jpg" alt="Jane Cooper" />
 *   <AvatarFallback>JC</AvatarFallback>
 * </Avatar>
 * ```
 */
const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>((props, forwardedRef) => {
  const { className, ...rest } = props;
  return (
    <StylelessAvatar
      className={cn(
        'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-[var(--radius-avatar)] bg-[var(--avatar-bg)] text-[var(--avatar-text)]',
        className,
      )}
      {...rest}
      ref={forwardedRef}
    />
  );
});

Avatar.displayName = 'Avatar';

export { Avatar };
export type { AvatarProps };
