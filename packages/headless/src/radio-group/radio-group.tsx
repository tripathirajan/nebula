
import { useControllableState } from '@nebula-lab/hooks';
import { Primitive } from '@nebula-lab/primitives/primitive';
import { RovingFocusGroup } from '@nebula-lab/primitives/roving-focus-group';
import * as React from 'react';


import { RadioGroupProvider } from './radio-group-context';

import type { ScopedProps } from './radio-group-context';
import type { PrimitivePropsWithRef } from '@nebula-lab/primitives/primitive';
import type { RovingFocusGroupOrientation } from '@nebula-lab/primitives/roving-focus-group';

interface RadioGroupProps extends PrimitivePropsWithRef<'div'> {
  /** Controlled: the currently selected item's value. */
  value?: string;
  /** Uncontrolled: the initially selected item's value. */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  /** Forwarded to every item's hidden native radio input for `<form>` submission. */
  name?: string;
  /** @default 'vertical' */
  orientation?: RovingFocusGroupOrientation;
  /** Arrow keys wrap from the last item back to the first. @default true */
  loop?: boolean;
}

/**
 * `role="radiogroup"` — a single-select group of {@link RadioGroupItem}s.
 * Keyboard navigation is delegated entirely to `@nebula-lab/primitives`'
 * `RovingFocusGroup`/`FocusItem` rather than reimplementing roving-tabindex
 * here — matching native `<input type="radio">` behavior, arrow-key
 * movement also selects the newly-focused item immediately (there's no
 * "manual activation mode" the way `Tabs` has; native radio groups don't
 * have one either).
 *
 * @example
 * ```tsx
 * <RadioGroup defaultValue="comfortable" aria-label="Density">
 *   <RadioGroupItem value="compact">Compact</RadioGroupItem>
 *   <RadioGroupItem value="comfortable">Comfortable</RadioGroupItem>
 *   <RadioGroupItem value="spacious">Spacious</RadioGroupItem>
 * </RadioGroup>
 * ```
 */
const RadioGroup = React.forwardRef<HTMLDivElement, ScopedProps<RadioGroupProps>>(
  (props, forwardedRef) => {
    const {
      __scopeRadioGroup,
      value: valueProp,
      defaultValue,
      onValueChange,
      disabled = false,
      required = false,
      name,
      orientation = 'vertical',
      loop = true,
      ...groupProps
    } = props;

    const [value, setValue] = useControllableState<string>({
      prop: valueProp,
      defaultProp: defaultValue,
      onChange: onValueChange,
    });

    return (
      <RadioGroupProvider
        scope={__scopeRadioGroup}
        value={value}
        onValueChange={setValue}
        disabled={disabled}
        name={name}
        required={required}
      >
        <RovingFocusGroup asChild orientation={orientation} loop={loop}>
          <Primitive
            as="div"
            role="radiogroup"
            aria-required={required || undefined}
            aria-orientation={orientation}
            data-disabled={disabled ? '' : undefined}
            {...groupProps}
            ref={forwardedRef}
          />
        </RovingFocusGroup>
      </RadioGroupProvider>
    );
  },
);

RadioGroup.displayName = 'RadioGroup';

export { RadioGroup };
export type { RadioGroupProps };
