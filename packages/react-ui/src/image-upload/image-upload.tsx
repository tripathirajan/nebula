import { useControllableState } from '@nebula/hooks';
import { cn } from '@nebula/primitives/cn';
import { ImagePreview } from '@nebula/styleless/image-preview';
import * as React from 'react';

import {
  FileUpload,
  FileUploadDropzone,
  FileUploadInput,
  FileUploadRemoveTrigger,
} from '../file-upload';

import type { FileUploadProps } from '@nebula/headless/file-upload';

/** Props accepted by {@link ImageUpload}. */
interface ImageUploadProps extends Omit<FileUploadProps, 'accept' | 'children'> {
  /** Text shown inside the dropzone when empty. @default 'Drop images here, or click to browse' */
  dropzoneLabel?: string;
  /** Applied to the outer wrapping `<div>` — `FileUpload`'s root renders no DOM of its own, so this component supplies the one wrapper element other styled components' `className` normally lands on. */
  className?: string;
}

/**
 * A ready-to-use image uploader — composes `@nebula/headless`'s
 * `FileUpload` (defaulting `accept="image/*"`) with `@nebula/styleless`'s
 * `ImagePreview` (which owns the real object-URL-lifecycle behavior) inside
 * a themed thumbnail grid. Deliberately a single self-contained component
 * rather than exposing `Root`/`Item` sub-parts — same call `PasswordField`/
 * `SearchField` already make for a preset with no meaningful composition
 * surface beyond what `FileUpload` itself already offers. Not built as its
 * own `styleless`-tier component: the grid layout, thumbnail sizing, and
 * remove-button overlay position are all visual choices with nothing
 * structural left to decouple once `ImagePreview` already owns the one real
 * behavior (see `LAYER_TAXONOMY.md` §4's File Upload note).
 *
 * Owns its own `files` controllable state (via the same `useControllableState`
 * hook `FileUpload` itself uses internally) rather than reaching into
 * `FileUpload`'s scoped context from outside — this component's grid needs
 * to read the current file list to render thumbnails, and `FileUpload`
 * doesn't expose its internal context publicly (by design, same
 * encapsulation every other compound component in this repo keeps).
 *
 * @example
 * ```tsx
 * <ImageUpload multiple files={files} onFilesChange={setFiles} />
 * ```
 */
const ImageUpload = React.forwardRef<HTMLDivElement, ImageUploadProps>((props, forwardedRef) => {
  const {
    className,
    dropzoneLabel = 'Drop images here, or click to browse',
    files: filesProp,
    defaultFiles,
    onFilesChange,
    ...rest
  } = props;

  const [files, setFiles] = useControllableState<File[]>({
    prop: filesProp,
    defaultProp: defaultFiles ?? [],
    onChange: onFilesChange,
  });
  const currentFiles = files ?? [];

  return (
    <div className={cn('flex flex-col gap-3', className)} ref={forwardedRef}>
      <FileUpload accept="image/*" files={currentFiles} onFilesChange={setFiles} {...rest}>
        <FileUploadDropzone>
          <FileUploadInput />
          {dropzoneLabel}
        </FileUploadDropzone>
        {currentFiles.length > 0 ? (
          <ul className="grid grid-cols-4 gap-2">
            {currentFiles.map((file, index) => (
              <li key={`${file.name}-${index}`} className="group relative">
                <ImagePreview
                  file={file}
                  alt={file.name}
                  className="aspect-square w-full rounded-[var(--radius-selector)] border border-[var(--file-upload-item-border)] object-cover"
                />
                <FileUploadRemoveTrigger
                  index={index}
                  aria-label={`Remove ${file.name}`}
                  className="absolute right-1 top-1 rounded-full bg-[var(--file-upload-remove-button-bg)]/90 shadow-sm opacity-0 group-hover:opacity-100"
                />
              </li>
            ))}
          </ul>
        ) : null}
      </FileUpload>
    </div>
  );
});

ImageUpload.displayName = 'ImageUpload';

export { ImageUpload };
export type { ImageUploadProps };
