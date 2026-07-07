import { FileUploadFileList as HeadlessFileUploadFileList } from '@nebula/headless/file-upload';
import { cn } from '@nebula/primitives/cn';
import * as React from 'react';

import type { FileUploadFileListProps as HeadlessFileUploadFileListProps } from '@nebula/headless/file-upload';

type FileUploadFileListProps = HeadlessFileUploadFileListProps;

const FileUploadFileList = React.forwardRef<HTMLUListElement, FileUploadFileListProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <HeadlessFileUploadFileList
        className={cn('mt-2 flex flex-col gap-2', className)}
        {...rest}
        ref={forwardedRef}
      />
    );
  },
);

FileUploadFileList.displayName = 'FileUploadFileList';

export { FileUploadFileList };
export type { FileUploadFileListProps };
