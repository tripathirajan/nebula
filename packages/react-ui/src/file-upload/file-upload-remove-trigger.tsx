import { cn } from '@nebula/primitives/cn';
import { FileUploadRemoveTrigger as StylelessFileUploadRemoveTrigger } from '@nebula/styleless/file-upload';
import * as React from 'react';

import type { FileUploadRemoveTriggerProps as StylelessFileUploadRemoveTriggerProps } from '@nebula/styleless/file-upload';

type FileUploadRemoveTriggerProps = StylelessFileUploadRemoveTriggerProps;

/** Defaults to a small "×" icon when no `children` is given — same convention `BreadcrumbSeparator`'s default chevron uses. */
const FileUploadRemoveTrigger = React.forwardRef<HTMLButtonElement, FileUploadRemoveTriggerProps>(
  (props, forwardedRef) => {
    const { className, children, ...rest } = props;
    return (
      <StylelessFileUploadRemoveTrigger
        className={cn(
          'rounded-[var(--radius-selector)] p-1 text-[var(--file-upload-text)]/60 outline-none hover:text-[var(--file-upload-text)] focus-visible:ring-2 focus-visible:ring-[var(--file-upload-text)]',
          className,
        )}
        {...rest}
        ref={forwardedRef}
      >
        {children ?? (
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        )}
      </StylelessFileUploadRemoveTrigger>
    );
  },
);

FileUploadRemoveTrigger.displayName = 'FileUploadRemoveTrigger';

export { FileUploadRemoveTrigger };
export type { FileUploadRemoveTriggerProps };
