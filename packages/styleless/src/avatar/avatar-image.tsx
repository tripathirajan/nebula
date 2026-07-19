import { Primitive } from '@nebula-lab/primitives/primitive';
import * as React from 'react';

import { useAvatarContext } from './avatar-context';

import type { PrimitivePropsWithRef } from '@nebula-lab/primitives/primitive';

const AVATAR_IMAGE_NAME = 'AvatarImage';

type AvatarImageProps = PrimitivePropsWithRef<'img'>;

/**
 * Renders an `img`, reporting its load/error state up to `Avatar` so
 * `AvatarFallback` knows whether to show itself — this component never
 * renders the fallback itself, it only ever renders (or doesn't render) the
 * `img` tag, since a broken `<img>` left in the DOM shows the browser's
 * broken-image icon even when a sibling `AvatarFallback` is meant to cover
 * for it.
 */
const AvatarImage = React.forwardRef<HTMLImageElement, AvatarImageProps>(
  (props, forwardedRef) => {
    const { src, onLoad, onError, ...rest } = props;
    const context = useAvatarContext(AVATAR_IMAGE_NAME);
    const { onImageLoadingStatusChange } = context;

    React.useEffect(() => {
      onImageLoadingStatusChange(src ? 'loading' : 'error');
    }, [src, onImageLoadingStatusChange]);

    if (context.imageLoadingStatus === 'error') return null;

    return (
      <Primitive
        as="img"
        src={src}
        {...rest}
        ref={forwardedRef}
        onLoad={(event) => {
          onImageLoadingStatusChange('loaded');
          onLoad?.(event);
        }}
        onError={(event) => {
          onImageLoadingStatusChange('error');
          onError?.(event);
        }}
      />
    );
  },
);

AvatarImage.displayName = AVATAR_IMAGE_NAME;

export { AvatarImage };
export type { AvatarImageProps };
