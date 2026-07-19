import { Textarea as PrimitiveTextarea } from '@nebula-lab/primitives/textarea';
import * as React from 'react';

import type { TextareaProps as PrimitiveTextareaProps } from '@nebula-lab/primitives/textarea';

/** Props accepted by {@link Textarea}. */
type TextareaProps = PrimitiveTextareaProps;

/**
 * `styleless`-tier `Textarea` — a thin pass-through of `@nebula-lab/primitives`'
 * own `Textarea` (already gives `invalid` -> `aria-invalid` wiring and
 * `autoResize`), same reasoning as this package's `Input`: exists so
 * `@nebula-lab/react-ui`'s `TextArea` chains through `styleless` consistently.
 *
 * @example
 * ```tsx
 * <Textarea autoResize placeholder="Write a description…" />
 * ```
 */
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>((props, forwardedRef) => {
  return <PrimitiveTextarea {...props} ref={forwardedRef} />;
});

Textarea.displayName = 'Textarea';

export { Textarea };
export type { TextareaProps };
