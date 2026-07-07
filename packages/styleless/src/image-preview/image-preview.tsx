import { Image } from '@nebula/primitives/image';
import * as React from 'react';

import type { ImageProps } from '@nebula/primitives/image';

/** Props accepted by {@link ImagePreview}. */
interface ImagePreviewProps extends Omit<ImageProps, 'src'> {
  /** The selected `File` to preview — typically one entry from `FileUpload`'s `files`. */
  file: File;
}

/**
 * `styleless`-tier `ImagePreview` — the real behavior an "image upload"
 * preset needs on top of `@nebula/headless`'s `FileUpload`: turning a
 * selected `File` into a renderable image without leaking memory. Calls
 * `URL.createObjectURL(file)` once per `file` identity and revokes it
 * (`URL.revokeObjectURL`) on unmount or whenever `file` changes — a real,
 * non-trivial lifecycle a consumer would otherwise have to hand-roll (and
 * often forgets the revoke half of). Renders `@nebula/primitives`' bare
 * `Image` with no size/border/grid classes — `@nebula/react-ui`'s
 * `ImageUpload` composes this inside a styled thumbnail grid.
 *
 * @example
 * ```tsx
 * <FileUploadFileItem file={file}>
 *   <ImagePreview file={file} alt={file.name} />
 * </FileUploadFileItem>
 * ```
 */
const ImagePreview = React.forwardRef<HTMLImageElement, ImagePreviewProps>(
  (props, forwardedRef) => {
    const { file, ...rest } = props;
    const [objectUrl, setObjectUrl] = React.useState<string | null>(null);

    React.useEffect(() => {
      const url = URL.createObjectURL(file);
      setObjectUrl(url);
      return () => URL.revokeObjectURL(url);
    }, [file]);

    if (!objectUrl) return null;

    return <Image src={objectUrl} {...rest} ref={forwardedRef} />;
  },
);

ImagePreview.displayName = 'ImagePreview';

export { ImagePreview };
export type { ImagePreviewProps };
