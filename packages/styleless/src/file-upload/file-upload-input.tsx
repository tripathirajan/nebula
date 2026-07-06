import { composeEventHandlers } from '@nebula/primitives/compose-event-handlers';
import { Input } from '@nebula/primitives/input';
import { VisuallyHidden } from '@nebula/primitives/visually-hidden';
import * as React from 'react';

import { useFileUploadContext } from './file-upload-context';

import type { ScopedProps } from './file-upload-context';
import type { InputProps } from '@nebula/primitives/input';

const FILE_UPLOAD_INPUT_NAME = 'FileUploadInput';

type FileUploadInputProps = Omit<InputProps, 'type' | 'accept' | 'multiple' | 'value'>;

/**
 * The real native `<input type="file">` — visually hidden (via
 * `VisuallyHidden`, not `display: none`, so it stays focusable/operable for
 * keyboard and screen-reader users), nested inside `FileUploadDropzone`'s
 * `<label>`. `accept`/`multiple`/`disabled` all come from `FileUpload`'s
 * context.
 *
 * @example
 * ```tsx
 * <FileUploadDropzone>
 *   <FileUploadInput />
 * </FileUploadDropzone>
 * ```
 */
const FileUploadInput = React.forwardRef<HTMLInputElement, ScopedProps<FileUploadInputProps>>(
  (props, forwardedRef) => {
    const { __scopeFileUpload, id, onChange, ...inputProps } = props;
    const context = useFileUploadContext(FILE_UPLOAD_INPUT_NAME, __scopeFileUpload);

    return (
      <VisuallyHidden as="span">
        <Input
          type="file"
          id={id ?? context.inputId}
          accept={context.accept}
          multiple={context.multiple}
          disabled={context.disabled}
          {...inputProps}
          ref={forwardedRef}
          onChange={composeEventHandlers(onChange, (event) => {
            context.addFiles(Array.from(event.currentTarget.files ?? []));
            // Reset so selecting the same file again still fires `onChange`.
            event.currentTarget.value = '';
          })}
        />
      </VisuallyHidden>
    );
  },
);

FileUploadInput.displayName = FILE_UPLOAD_INPUT_NAME;

export { FileUploadInput };
export type { FileUploadInputProps };
