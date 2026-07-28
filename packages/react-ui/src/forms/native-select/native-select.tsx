import { cn } from '@nebula-lab/primitives/cn';
import { NativeSelect as PrimitiveNativeSelect } from '@nebula-lab/primitives/native-select';
import * as React from 'react';

import { inputVariants } from '../../input/input';

import type { NativeSelectProps as PrimitiveNativeSelectProps } from '@nebula-lab/primitives/native-select';
import type { VariantProps } from 'class-variance-authority';

type NativeSelectProps = PrimitiveNativeSelectProps & VariantProps<typeof inputVariants>;

/**
 * Styled native `<select>` — wraps `@nebula-lab/primitives`' unstyled
 * `NativeSelect` (which already gives `invalid` -> `aria-invalid` wiring)
 * with `Input`'s own `inputVariants` recipe, so a native select reads as
 * pixel-identical to `Input`/`Select` rather than needing its own visual
 * language. Reach for this over `@nebula-lab/react-ui`'s `Select` when the
 * browser's own native popup is preferable (mobile-native feel, a long
 * plain option list, no rich item content) — `Select` is for anything
 * needing custom item rendering or search.
 *
 * @example
 * ```tsx
 * <NativeSelect name="country" defaultValue="us">
 *   <option value="us">United States</option>
 *   <option value="ca">Canada</option>
 * </NativeSelect>
 * ```
 */
const NativeSelect = React.forwardRef<HTMLSelectElement, NativeSelectProps>((props, forwardedRef) => {
  const { className, variant, ...rest } = props;
  return (
    <PrimitiveNativeSelect
      className={cn(inputVariants({ variant }), className)}
      {...rest}
      ref={forwardedRef}
    />
  );
});

NativeSelect.displayName = 'NativeSelect';

export { NativeSelect };
export type { NativeSelectProps };
