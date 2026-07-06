import { cn } from '@nebula/primitives/cn';
import { FileUploadFileList as StylelessFileUploadFileList } from '@nebula/styleless/file-upload';
import * as React from 'react';

import type { FileUploadFileListProps as StylelessFileUploadFileListProps } from '@nebula/styleless/file-upload';

type FileUploadFileListProps = StylelessFileUploadFileListProps;

const FileUploadFileList = React.forwardRef<HTMLUListElement, FileUploadFileListProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <StylelessFileUploadFileList
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
