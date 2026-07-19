import { FileUploadRemoveTrigger as HeadlessFileUploadRemoveTrigger } from '@nebula-lab/headless/file-upload';
import { cn } from '@nebula-lab/primitives/cn';
import * as React from 'react';

import type { FileUploadRemoveTriggerProps as HeadlessFileUploadRemoveTriggerProps } from '@nebula-lab/headless/file-upload';

type FileUploadRemoveTriggerProps = HeadlessFileUploadRemoveTriggerProps;

/** Defaults to a small "×" icon when no `children` is given — same convention `BreadcrumbSeparator`'s default chevron uses. */
const FileUploadRemoveTrigger = React.forwardRef<HTMLButtonElement, FileUploadRemoveTriggerProps>(
  (props, forwardedRef) => {
    const { className, children, ...rest } = props;
    return (
      <HeadlessFileUploadRemoveTrigger
        className={cn(
          'rounded-[var(--radius-selector)] p-1 text-[var(--file-upload-text)]/60 outline-none hover:text-[var(--file-upload-text)] focus-visible:ring-2 focus-visible:ring-[var(--file-upload-text)] focus-visible:ring-offset-1',
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
      </HeadlessFileUploadRemoveTrigger>
    );
  },
);

FileUploadRemoveTrigger.displayName = 'FileUploadRemoveTrigger';

export { FileUploadRemoveTrigger };
export type { FileUploadRemoveTriggerProps };
