import { cn } from '@nebula/primitives/cn';
import { Primitive } from '@nebula/primitives/primitive';
import * as React from 'react';

import { AvatarProvider } from './avatar-context';

import type { ImageLoadingStatus } from './avatar-context';
import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';

type AvatarProps = PrimitivePropsWithRef<'span'>;

/**
 * Root — tracks whether `AvatarImage` has loaded, errored, or is still
 * loading, so `AvatarFallback` knows when to render. Split into three
 * components (`Avatar`/`AvatarImage`/`AvatarFallback`) rather than one
 * `src`+`fallback`-prop component so the fallback can be arbitrary markup
 * (initials, an icon, a skeleton) instead of a single `ReactNode` prop.
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
  const [imageLoadingStatus, setImageLoadingStatus] = React.useState<ImageLoadingStatus>('idle');

  return (
    <AvatarProvider
      imageLoadingStatus={imageLoadingStatus}
      onImageLoadingStatusChange={setImageLoadingStatus}
    >
      <Primitive
        as="span"
        className={cn(
          'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-[var(--radius-avatar)] bg-[var(--avatar-bg)] text-[var(--avatar-text)]',
          className,
        )}
        {...rest}
        ref={forwardedRef}
      />
    </AvatarProvider>
  );
});

Avatar.displayName = 'Avatar';

export { Avatar };
export type { AvatarProps };
