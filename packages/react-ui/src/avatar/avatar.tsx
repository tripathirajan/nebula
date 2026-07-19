import { cn } from '@nebula-lab/primitives/cn';
import { Avatar as StylelessAvatar } from '@nebula-lab/styleless/avatar';
import { cva } from 'class-variance-authority';
import * as React from 'react';

import type { AvatarProps as StylelessAvatarProps } from '@nebula-lab/styleless/avatar';
import type { VariantProps } from 'class-variance-authority';

/**
 * `circle` is hardcoded `rounded-full` rather than reading `--radius-avatar`
 * — at this component's fixed 40px box, `--radius-avatar`'s pill-shaped
 * default (`2rem`) happens to render fully round today, but only because
 * 32px already clears the browser's round-corner clamp at this size; a
 * consumer dialing `--radius-avatar` down for a squarer theme would
 * silently break the circle. `rounded` is the shape that actually reads the
 * token, so overriding it is exactly where that theming hook belongs.
 */
const avatarVariants = cva(
  'relative flex h-10 w-10 shrink-0 overflow-hidden bg-[var(--avatar-bg)] text-[var(--avatar-text)]',
  {
    variants: {
      shape: {
        circle: 'rounded-full',
        rounded: 'rounded-[var(--radius-avatar)]',
        square: 'rounded-none',
      },
    },
    defaultVariants: { shape: 'circle' },
  },
);

type AvatarProps = StylelessAvatarProps & VariantProps<typeof avatarVariants>;

/**
 * Styled wrapper around `@nebula-lab/styleless`'s `Avatar` — the image
 * load/error tracking that lets `AvatarFallback` know when to render comes
 * from there unchanged (moved down this session, since it's reusable
 * non-visual state with no styling opinion, same bucket `PasswordInput`'s
 * visibility toggle already lives in). This layer only adds the frame
 * (`--avatar-bg`/`-text`, fixed 40px size, `overflow-hidden`) and the
 * `shape` variant (`circle` default, `rounded`, `square`).
 *
 * @example
 * ```tsx
 * <Avatar>
 *   <AvatarImage src="/users/42.jpg" alt="Jane Cooper" />
 *   <AvatarFallback>JC</AvatarFallback>
 * </Avatar>
 * <Avatar shape="square">...</Avatar>
 * ```
 */
const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>((props, forwardedRef) => {
  const { className, shape, ...rest } = props;
  return (
    <StylelessAvatar className={cn(avatarVariants({ shape }), className)} {...rest} ref={forwardedRef} />
  );
});

Avatar.displayName = 'Avatar';

export { Avatar, avatarVariants };
export type { AvatarProps };
