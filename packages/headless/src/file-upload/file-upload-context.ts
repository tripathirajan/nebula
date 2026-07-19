import { createContextScope } from '@nebula-lab/primitives/create-context-scope';

import type { Scope } from '@nebula-lab/primitives/create-context-scope';

interface FileUploadContextValue {
  files: File[];
  addFiles: (newFiles: File[]) => void;
  removeFile: (index: number) => void;
  accept: string | undefined;
  multiple: boolean;
  disabled: boolean;
  isDraggingOver: boolean;
  setIsDraggingOver: (value: boolean) => void;
  inputId: string;
}

const FILE_UPLOAD_NAME = 'FileUpload';

/**
 * Scoped context factory for FileUpload — mirrors every other compound
 * component's use of `createContextScope`.
 */
const [createFileUploadContext, createFileUploadScope] = createContextScope(FILE_UPLOAD_NAME);
const [FileUploadProvider, useFileUploadContext] =
  createFileUploadContext<FileUploadContextValue>(FILE_UPLOAD_NAME);

/** Every consumer prop object accepts an optional internal `__scopeFileUpload` prop threaded through by `createFileUploadScope` — not part of the public API. */
type ScopedProps<P> = P & { __scopeFileUpload?: Scope<FileUploadContextValue> };

export {
  FILE_UPLOAD_NAME,
  FileUploadProvider,
  useFileUploadContext,
  createFileUploadScope,
};
export type { FileUploadContextValue, ScopedProps };
