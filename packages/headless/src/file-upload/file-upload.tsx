import { useControllableState, useId } from '@nebula-lab/hooks';
import * as React from 'react';

import { FileUploadProvider } from './file-upload-context';

import type { ScopedProps } from './file-upload-context';

interface FileUploadProps {
  files?: File[];
  defaultFiles?: File[];
  onFilesChange?: (files: File[]) => void;
  /** Forwarded to the underlying native `<input type="file" accept>`. */
  accept?: string;
  /** @default false */
  multiple?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
}

/**
 * Root of the FileUpload compound component — a drag-and-drop zone
 * (`FileUploadDropzone`) wrapping a real native `<input type="file">`
 * (`FileUploadInput`), so click-to-open and full keyboard/screen-reader
 * operability come from the browser's own `<label>`-wraps-`<input>` behavior
 * rather than a hand-rolled `role="button"` + focus-management
 * reimplementation. Drag-and-drop is a mouse/touch-only *addition* on top of
 * that, not a replacement for it.
 *
 * @example
 * ```tsx
 * <FileUpload multiple accept="image/*" onFilesChange={setFiles}>
 *   <FileUploadDropzone>
 *     <FileUploadInput />
 *     Drop images here, or click to browse
 *   </FileUploadDropzone>
 *   <FileUploadFileList>
 *     {files.map((file, index) => (
 *       <FileUploadFileItem key={file.name} file={file}>
 *         {file.name}
 *         <FileUploadRemoveTrigger index={index} aria-label={`Remove ${file.name}`} />
 *       </FileUploadFileItem>
 *     ))}
 *   </FileUploadFileList>
 * </FileUpload>
 * ```
 */
function FileUpload(props: ScopedProps<FileUploadProps>) {
  const {
    __scopeFileUpload,
    files: filesProp,
    defaultFiles = [],
    onFilesChange,
    accept,
    multiple = false,
    disabled = false,
    children,
  } = props;

  const [files, setFiles] = useControllableState<File[]>({
    prop: filesProp,
    defaultProp: defaultFiles,
    onChange: onFilesChange,
  });
  const [isDraggingOver, setIsDraggingOver] = React.useState(false);
  const inputId = useId('nebula-file-upload-input');

  return (
    <FileUploadProvider
      scope={__scopeFileUpload}
      files={files ?? defaultFiles}
      addFiles={(newFiles) => {
        setFiles((current) => (multiple ? [...(current ?? []), ...newFiles] : newFiles.slice(0, 1)));
      }}
      removeFile={(index) => {
        setFiles((current) => (current ?? []).filter((_, i) => i !== index));
      }}
      accept={accept}
      multiple={multiple}
      disabled={disabled}
      isDraggingOver={isDraggingOver}
      setIsDraggingOver={setIsDraggingOver}
      inputId={inputId}
    >
      {children}
    </FileUploadProvider>
  );
}

export { FileUpload };
export type { FileUploadProps };
