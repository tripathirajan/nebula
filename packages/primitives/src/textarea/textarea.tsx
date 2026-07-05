import * as React from 'react';

import { composeEventHandlers } from '../compose-event-handlers/compose-event-handlers';
import { useComposedRefs } from '../compose-refs/compose-refs';
import { Primitive } from '../primitive/primitive';

import type { PrimitivePropsWithRef } from '../primitive/primitive';

interface TextareaOwnProps {
  /** Sets `aria-invalid="true"`. */
  invalid?: boolean;
  /**
   * Grows/shrinks the textarea's height to fit its content instead of
   * showing a scrollbar — recalculated on every `input` event. Implemented
   * by resetting `height` to `'auto'` then reading `scrollHeight`, which
   * forces a synchronous layout; fine for a single textarea, but avoid this
   * on e.g. every row of a large editable table.
   * @default false
   */
  autoResize?: boolean;
}

/** Props accepted by {@link Textarea}. */
type TextareaProps = PrimitivePropsWithRef<'textarea'> & TextareaOwnProps;

/**
 * Unstyled `textarea`, optionally auto-resizing to fit its content.
 *
 * @example
 * ```tsx
 * <Textarea autoResize placeholder="Write a description…" invalid={!!errors.description} />
 * ```
 */
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>((props, forwardedRef) => {
  const { invalid, autoResize = false, onInput, ...rest } = props;
  const nodeRef = React.useRef<HTMLTextAreaElement>(null);
  const composedRef = useComposedRefs(forwardedRef, nodeRef);

  const resize = (element: HTMLTextAreaElement) => {
    element.style.height = 'auto';
    element.style.height = `${element.scrollHeight}px`;
  };

  React.useEffect(() => {
    if (autoResize && nodeRef.current) resize(nodeRef.current);
  }, [autoResize]);

  return (
    <Primitive
      as="textarea"
      aria-invalid={invalid || undefined}
      {...rest}
      ref={composedRef}
      onInput={composeEventHandlers(onInput, (event) => {
        if (autoResize) resize(event.currentTarget);
      })}
    />
  );
});

Textarea.displayName = 'Textarea';

export { Textarea };
export type { TextareaProps };
