import { RadioGroup as HeadlessRadioGroup } from '@nebula/headless/radio-group';
import { cn } from '@nebula/primitives/cn';
import * as React from 'react';

import type { RadioGroupProps as HeadlessRadioGroupProps } from '@nebula/headless/radio-group';

type RadioGroupProps = HeadlessRadioGroupProps;

/**
 * Styled wrapper around `@nebula/headless`'s `RadioGroup` — roving-tabindex
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
    <HeadlessRadioGroup className={cn('flex flex-col gap-2', className)} {...rest} ref={forwardedRef} />
  );
});

RadioGroup.displayName = 'RadioGroup';

export { RadioGroup };
export type { RadioGroupProps };
