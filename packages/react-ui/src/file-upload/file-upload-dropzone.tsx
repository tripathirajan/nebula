import { cn } from '@nebula/primitives/cn';
import { FileUploadDropzone as StylelessFileUploadDropzone } from '@nebula/styleless/file-upload';
import * as React from 'react';

import type { FileUploadDropzoneProps as StylelessFileUploadDropzoneProps } from '@nebula/styleless/file-upload';

type FileUploadDropzoneProps = StylelessFileUploadDropzoneProps;

/** Dashed drop-zone card — `data-dragging-over` (set by the styleless source while a drag is over it) fills the border with `--file-upload-dropzone-active-border`. */
const FileUploadDropzone = React.forwardRef<HTMLLabelElement, FileUploadDropzoneProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <StylelessFileUploadDropzone
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center gap-1 rounded-[var(--radius-box)] border-2 border-dashed border-[var(--file-upload-dropzone-border)] p-6 text-center text-sm text-[var(--file-upload-text)]/70 transition-colors data-[dragging-over]:border-[var(--file-upload-dropzone-active-border)] data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
          className,
        )}
        {...rest}
        ref={forwardedRef}
      />
    );
  },
);

FileUploadDropzone.displayName = 'FileUploadDropzone';

export { FileUploadDropzone };
export type { FileUploadDropzoneProps };
