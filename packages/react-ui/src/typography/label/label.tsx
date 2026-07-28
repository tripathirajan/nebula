import { cn } from '@nebula-lab/primitives/cn';
import { Label as PrimitiveLabel } from '@nebula-lab/primitives/label';
import * as React from 'react';

import type { LabelProps as PrimitiveLabelProps } from '@nebula-lab/primitives/label';

/**
 * Styled `Label` — wraps `@nebula-lab/primitives`' unstyled `Label` (which
 * already gives the `required` asterisk + screen-reader announcement) and
 * adds the same `text-sm font-medium text-[var(--field-label-text)]`
 * treatment `FieldLabel` uses, for a standalone labeled control that isn't
 * wrapped in `Field` (`FieldLabel` reads label state off `Field`'s own
 * context, which only exists inside one).
 *
 * @example
 * ```tsx
 * <Label htmlFor="search" required>Search</Label>
 * <NativeSelect id="search" required />
 * ```
 */
const Label = React.forwardRef<HTMLLabelElement, PrimitiveLabelProps>((props, forwardedRef) => {
  const { className, ...rest } = props;
  return (
    <PrimitiveLabel
      className={cn('text-sm font-medium text-[var(--field-label-text)]', className)}
      {...rest}
      ref={forwardedRef}
    />
  );
});

Label.displayName = 'Label';

export { Label };
export type { PrimitiveLabelProps as LabelProps };
