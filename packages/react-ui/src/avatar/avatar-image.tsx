import { cn } from '@nebula-lab/primitives/cn';
import { AvatarImage as StylelessAvatarImage } from '@nebula-lab/styleless/avatar';
import * as React from 'react';

import type { AvatarImageProps as StylelessAvatarImageProps } from '@nebula-lab/styleless/avatar';

type AvatarImageProps = StylelessAvatarImageProps;

/**
 * Styled wrapper around `@nebula-lab/styleless`'s `AvatarImage` — the
 * load/error reporting to `Avatar`'s context, and hiding the `img` entirely
 * on error, come from there unchanged. This layer adds only the fill/crop
 * treatment.
 */
const AvatarImage = React.forwardRef<HTMLImageElement, AvatarImageProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <StylelessAvatarImage
        className={cn('aspect-square h-full w-full object-cover', className)}
        {...rest}
        ref={forwardedRef}
      />
    );
  },
);

AvatarImage.displayName = 'AvatarImage';

export { AvatarImage };
export type { AvatarImageProps };
