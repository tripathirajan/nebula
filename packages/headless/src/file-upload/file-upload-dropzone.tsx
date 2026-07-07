import { composeEventHandlers } from '@nebula/primitives/compose-event-handlers';
import { Primitive } from '@nebula/primitives/primitive';
import * as React from 'react';

import { useFileUploadContext } from './file-upload-context';

import type { ScopedProps } from './file-upload-context';
import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';

const FILE_UPLOAD_DROPZONE_NAME = 'FileUploadDropzone';

type FileUploadDropzoneProps = PrimitivePropsWithRef<'label'>;

/**
 * Renders a `<label>` (not a `div`/`button`) wrapping `FileUploadInput` —
 * clicking anywhere in it opens the native file picker via the browser's own
 * label-activates-its-control behavior, no click handler or `role="button"`
 * needed for that part. Adds one real behavior on top: dropping files
 * anywhere on it calls `FileUpload`'s `addFiles`, with `data-dragging-over`
 * reflecting the live drag state for `react-ui` to style a highlight.
 *
 * @example
 * ```tsx
 * <FileUploadDropzone>
 *   <FileUploadInput />
 *   Drop files here, or click to browse
 * </FileUploadDropzone>
 * ```
 */
const FileUploadDropzone = React.forwardRef<HTMLLabelElement, ScopedProps<FileUploadDropzoneProps>>(
  (props, forwardedRef) => {
    const { __scopeFileUpload, onDragOver, onDragLeave, onDrop, ...dropzoneProps } = props;
    const context = useFileUploadContext(FILE_UPLOAD_DROPZONE_NAME, __scopeFileUpload);

    return (
      <Primitive
        as="label"
        htmlFor={context.inputId}
        data-dragging-over={context.isDraggingOver ? '' : undefined}
        data-disabled={context.disabled ? '' : undefined}
        {...dropzoneProps}
        ref={forwardedRef}
        onDragOver={composeEventHandlers(onDragOver, (event) => {
          if (context.disabled) return;
          event.preventDefault();
          context.setIsDraggingOver(true);
        })}
        onDragLeave={composeEventHandlers(onDragLeave, () => {
          context.setIsDraggingOver(false);
        })}
        onDrop={composeEventHandlers(onDrop, (event) => {
          event.preventDefault();
          context.setIsDraggingOver(false);
          if (context.disabled) return;
          context.addFiles(Array.from(event.dataTransfer.files));
        })}
      />
    );
  },
);

FileUploadDropzone.displayName = FILE_UPLOAD_DROPZONE_NAME;

export { FileUploadDropzone };
export type { FileUploadDropzoneProps };
