import * as React from 'react';

import { Primitive } from '../primitive/primitive';

import type { PrimitivePropsWithRef } from '../primitive/primitive';

interface NativeSelectOwnProps {
  /** Sets `aria-invalid="true"`. */
  invalid?: boolean;
}

/** Props accepted by {@link NativeSelect}. */
type NativeSelectProps = PrimitivePropsWithRef<'select'> & NativeSelectOwnProps;

/**
 * Unstyled native `<select>` — no popup/listbox behavior to add on top of
 * what the browser already provides (unlike `@nebula/headless`'s `Select`,
 * which builds a fully custom popup listbox for cases that need one), so
 * this stays exactly here at the primitives layer, same treatment `Input`/
 * `Textarea` get: a thin `aria-invalid` wiring wrapper around the real
 * native element, no separate `@nebula/headless` compound needed.
 *
 * @example
 * ```tsx
 * <NativeSelect name="country" invalid={!!errors.country}>
 *   <option value="us">United States</option>
 *   <option value="ca">Canada</option>
 * </NativeSelect>
 * ```
 */
const NativeSelect = React.forwardRef<HTMLSelectElement, NativeSelectProps>(
  (props, forwardedRef) => {
    const { invalid, ...rest } = props;
    return (
      <Primitive as="select" aria-invalid={invalid || undefined} {...rest} ref={forwardedRef} />
    );
  },
);

NativeSelect.displayName = 'NativeSelect';

export { NativeSelect };
export type { NativeSelectProps };
