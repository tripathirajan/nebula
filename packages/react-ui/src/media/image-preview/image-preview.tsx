import { cn } from '@nebula-lab/primitives/cn';
import { ImagePreview as StylelessImagePreview } from '@nebula-lab/styleless/image-preview';
import * as React from 'react';

import type { ImagePreviewProps as StylelessImagePreviewProps } from '@nebula-lab/styleless/image-preview';

type ImagePreviewProps = StylelessImagePreviewProps;

/**
 * Styled `ImagePreview` — wraps `@nebula-lab/styleless`'s `ImagePreview`
 * (which owns the real behavior: turning a selected `File` into a
 * renderable image via `URL.createObjectURL`, revoked on unmount/change)
 * with the same thumbnail treatment `ImageUpload`'s own grid already uses,
 * for a bare single-image preview outside a full upload flow.
 *
 * @example
 * ```tsx
 * <ImagePreview file={selectedFile} alt={selectedFile.name} className="h-24 w-24" />
 * ```
 */
const ImagePreview = React.forwardRef<HTMLImageElement, ImagePreviewProps>((props, forwardedRef) => {
  const { className, ...rest } = props;
  return (
    <StylelessImagePreview
      className={cn(
        'aspect-square w-full rounded-[var(--radius-selector)] border border-[var(--file-upload-item-border)] object-cover',
        className,
      )}
      {...rest}
      ref={forwardedRef}
    />
  );
});

ImagePreview.displayName = 'ImagePreview';

export { ImagePreview };
export type { ImagePreviewProps };
