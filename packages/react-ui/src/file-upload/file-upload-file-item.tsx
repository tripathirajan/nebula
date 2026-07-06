import { cn } from '@nebula/primitives/cn';
import { FileUploadFileItem as StylelessFileUploadFileItem } from '@nebula/styleless/file-upload';
import * as React from 'react';

import type { FileUploadFileItemProps as StylelessFileUploadFileItemProps } from '@nebula/styleless/file-upload';

type FileUploadFileItemProps = StylelessFileUploadFileItemProps;

const FileUploadFileItem = React.forwardRef<HTMLLIElement, FileUploadFileItemProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <StylelessFileUploadFileItem
        className={cn(
          'flex items-center justify-between gap-2 rounded-[var(--radius-selector)] border border-[var(--file-upload-item-border)] px-3 py-2 text-sm text-[var(--file-upload-text)]',
          className,
        )}
        {...rest}
        ref={forwardedRef}
      />
    );
  },
);

FileUploadFileItem.displayName = 'FileUploadFileItem';

export { FileUploadFileItem };
export type { FileUploadFileItemProps };
