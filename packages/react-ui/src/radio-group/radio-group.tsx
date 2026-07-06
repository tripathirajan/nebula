import { cn } from '@nebula/primitives/cn';
import { RadioGroup as StylelessRadioGroup } from '@nebula/styleless/radio-group';
import * as React from 'react';

import type { RadioGroupProps as StylelessRadioGroupProps } from '@nebula/styleless/radio-group';

type RadioGroupProps = StylelessRadioGroupProps;

/**
 * Styled wrapper around `@nebula/styleless`'s `RadioGroup` — roving-tabindex
 * arrow-key navigation and single-select state come from there unchanged.
 * This layer only lays out `RadioGroupItem`s with consistent spacing; the
 * item's own visual styling lives on `RadioGroupItem`.
 *
 * @example
 * ```tsx
 * <RadioGroup defaultValue="comfortable" aria-label="Density">
 *   <RadioGroupItem value="compact">Compact</RadioGroupItem>
 *   <RadioGroupItem value="comfortable">Comfortable</RadioGroupItem>
 * </RadioGroup>
 * ```
 */
const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>((props, forwardedRef) => {
  const { className, ...rest } = props;
  return (
    <StylelessRadioGroup className={cn('flex flex-col gap-2', className)} {...rest} ref={forwardedRef} />
  );
});

RadioGroup.displayName = 'RadioGroup';

export { RadioGroup };
export type { RadioGroupProps };
