import * as React from 'react';

import { Primitive } from '../primitive/primitive';
import { VisuallyHidden } from '../visually-hidden/visually-hidden';

import type { PrimitivePropsWithRef } from '../primitive/primitive';

interface LabelOwnProps {
  /**
   * Appends a visible `*` plus a screen-reader-only "(required)" so the
   * requirement is announced even though the asterisk itself is
   * `aria-hidden` (a bare `*` reads as "asterisk" or is skipped entirely
   * depending on the screen reader/verbosity setting — neither says
   * "required").
   */
  required?: boolean;
}

/** Props accepted by {@link Label}. */
type LabelProps = PrimitivePropsWithRef<'label'> & LabelOwnProps;

/**
 * Unstyled `label`. Always pass `htmlFor` (matching the field's `id`) — this
 * component doesn't infer it automatically, since guessing wrong (silently
 * linking to the wrong field) is worse than a lint rule catching a missing
 * `htmlFor` at author time.
 *
 * @example
 * ```tsx
 * <Label htmlFor="email" required>Email</Label>
 * <Input id="email" name="email" type="email" required />
 * ```
 */
const Label = React.forwardRef<HTMLLabelElement, LabelProps>((props, forwardedRef) => {
  const { required, children, ...rest } = props;
  return (
    <Primitive as="label" {...rest} ref={forwardedRef}>
      {children}
      {required ? (
        <>
          {' '}
          <span aria-hidden="true">*</span>
          <VisuallyHidden>(required)</VisuallyHidden>
        </>
      ) : null}
    </Primitive>
  );
});

Label.displayName = 'Label';

export { Label };
export type { LabelProps };
