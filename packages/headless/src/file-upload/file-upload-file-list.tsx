import { Primitive } from '@nebula-lab/primitives/primitive';
import * as React from 'react';

import type { PrimitivePropsWithRef } from '@nebula-lab/primitives/primitive';

const FILE_UPLOAD_FILE_LIST_NAME = 'FileUploadFileList';

type FileUploadFileListProps = PrimitivePropsWithRef<'ul'>;

/**
 * `role="list"` (via the native `<ul>` it renders as) wrapping
 * {@link FileUploadFileItem}s — purely structural, no state; map over
 * `FileUpload`'s `files` yourself and render one `FileUploadFileItem` per
 * entry.
 *
 * @example
 * ```tsx
 * <FileUploadFileList>
 *   {files.map((file, index) => (
 *     <FileUploadFileItem key={file.name} file={file}>
 *       {file.name}
 *     </FileUploadFileItem>
 *   ))}
 * </FileUploadFileList>
 * ```
 */
const FileUploadFileList = React.forwardRef<HTMLUListElement, FileUploadFileListProps>(
  (props, forwardedRef) => <Primitive as="ul" {...props} ref={forwardedRef} />,
);

FileUploadFileList.displayName = FILE_UPLOAD_FILE_LIST_NAME;

export { FileUploadFileList };
export type { FileUploadFileListProps };
