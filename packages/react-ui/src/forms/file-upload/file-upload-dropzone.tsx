import { FileUploadDropzone as HeadlessFileUploadDropzone } from '@nebula-lab/headless/file-upload';
import { cn } from '@nebula-lab/primitives/cn';
import * as React from 'react';

import type { FileUploadDropzoneProps as HeadlessFileUploadDropzoneProps } from '@nebula-lab/headless/file-upload';

type FileUploadDropzoneProps = HeadlessFileUploadDropzoneProps;

/** Dashed drop-zone card — `data-dragging-over` (set by the headless source while a drag is over it) fills the border with `--file-upload-dropzone-active-border`. */
const FileUploadDropzone = React.forwardRef<HTMLLabelElement, FileUploadDropzoneProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <HeadlessFileUploadDropzone
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
