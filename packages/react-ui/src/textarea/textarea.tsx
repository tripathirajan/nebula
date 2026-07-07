import { cn } from '@nebula/primitives/cn';
import { Textarea as StylelessTextarea } from '@nebula/styleless/textarea';
import * as React from 'react';

import type { TextareaProps as StylelessTextareaProps } from '@nebula/styleless/textarea';

/**
 * Styled `textarea` — wraps `@nebula/styleless`'s `Textarea` (itself a thin
 * pass-through of `@nebula/primitives`' `Textarea`, which gives `invalid`
 * -> `aria-invalid` wiring, ref forwarding, and the optional `autoResize`
 * behavior) the same way this package's `Input` wraps `styleless`'s
 * `Input`; there's no separate `@nebula/headless` layer for this the way
 * most other form fields have, mirroring how `headless` itself has no
 * `Textarea` (see `AGENTS.md`'s `packages/headless` row).
 *
 * @example
 * ```tsx
 * <TextArea autoResize placeholder="Write a description…" />
 * <TextArea invalid aria-describedby="description-error" />
 * ```
 */
const TextArea = React.forwardRef<HTMLTextAreaElement, StylelessTextareaProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <StylelessTextarea
        className={cn(
          'flex min-h-20 w-full rounded-[var(--radius-field)] border border-[var(--input-border)] bg-[var(--input-bg)] px-3 py-2 text-sm text-[var(--input-text)] transition-colors placeholder:text-[var(--input-text)]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--input-ring)] focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-[var(--input-invalid-border)] aria-[invalid=true]:focus-visible:ring-[var(--input-invalid-ring)]',
          className,
        )}
        {...rest}
        ref={forwardedRef}
      />
    );
  },
);

TextArea.displayName = 'TextArea';

export { TextArea };
export type { StylelessTextareaProps as TextAreaProps };
