import { Primitive } from '@nebula/primitives/primitive';
import * as React from 'react';

import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';

const FILE_UPLOAD_FILE_ITEM_NAME = 'FileUploadFileItem';

interface FileUploadFileItemProps extends PrimitivePropsWithRef<'li'> {
  /** The file this row represents — not read internally, just typed here so consumers reliably pass one (e.g. for a future thumbnail/size display) rather than this being purely presentational with no contract at all. */
  file: File;
}

/**
 * `role="listitem"` (via the native `<li>` it renders as) for one selected
 * file — purely structural; render whatever you want inside (name, size,
 * a thumbnail, a `FileUploadRemoveTrigger`).
 *
 * @example
 * ```tsx
 * <FileUploadFileItem file={file}>
 *   {file.name}
 *   <FileUploadRemoveTrigger index={index} aria-label={`Remove ${file.name}`} />
 * </FileUploadFileItem>
 * ```
 */
const FileUploadFileItem = React.forwardRef<HTMLLIElement, FileUploadFileItemProps>(
  (props, forwardedRef) => {
    const { file: _file, ...itemProps } = props;
    return <Primitive as="li" {...itemProps} ref={forwardedRef} />;
  },
);

FileUploadFileItem.displayName = FILE_UPLOAD_FILE_ITEM_NAME;

export { FileUploadFileItem };
export type { FileUploadFileItemProps };
