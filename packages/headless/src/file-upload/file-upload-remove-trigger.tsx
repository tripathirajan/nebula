import { composeEventHandlers } from '@nebula-lab/primitives/compose-event-handlers';
import { Primitive } from '@nebula-lab/primitives/primitive';
import * as React from 'react';

import { useFileUploadContext } from './file-upload-context';

import type { ScopedProps } from './file-upload-context';
import type { PrimitivePropsWithRef } from '@nebula-lab/primitives/primitive';

const FILE_UPLOAD_REMOVE_TRIGGER_NAME = 'FileUploadRemoveTrigger';

interface FileUploadRemoveTriggerProps extends PrimitivePropsWithRef<'button'> {
  /** The index (within `FileUpload`'s `files`) to remove on click. */
  index: number;
}

/**
 * Removes one file from `FileUpload`'s list by index. Always pass an
 * `aria-label` (e.g. naming the specific file) — there's rarely visible
 * text on a plain "×" button.
 *
 * @example
 * ```tsx
 * <FileUploadRemoveTrigger index={index} aria-label={`Remove ${file.name}`} />
 * ```
 */
const FileUploadRemoveTrigger = React.forwardRef<
  HTMLButtonElement,
  ScopedProps<FileUploadRemoveTriggerProps>
>((props, forwardedRef) => {
  const { __scopeFileUpload, index, onClick, ...triggerProps } = props;
  const context = useFileUploadContext(FILE_UPLOAD_REMOVE_TRIGGER_NAME, __scopeFileUpload);

  return (
    <Primitive
      as="button"
      type="button"
      {...triggerProps}
      ref={forwardedRef}
      onClick={composeEventHandlers(onClick, () => context.removeFile(index))}
    />
  );
});

FileUploadRemoveTrigger.displayName = FILE_UPLOAD_REMOVE_TRIGGER_NAME;

export { FileUploadRemoveTrigger };
export type { FileUploadRemoveTriggerProps };
