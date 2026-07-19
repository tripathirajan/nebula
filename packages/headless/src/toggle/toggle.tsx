
import { useControllableState } from '@nebula-lab/hooks';
import { composeEventHandlers } from '@nebula-lab/primitives/compose-event-handlers';
import { Primitive } from '@nebula-lab/primitives/primitive';
import * as React from 'react';


import type { PrimitivePropsWithRef } from '@nebula-lab/primitives/primitive';

interface ToggleProps extends PrimitivePropsWithRef<'button'> {
  /** Controlled pressed state. */
  pressed?: boolean;
  /** Uncontrolled initial state. @default false */
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  disabled?: boolean;
}

/**
 * A two-state toggle button — `aria-pressed`, not `Switch`'s
 * `role="switch"`/`aria-checked`, per the WAI-ARIA
 * [Button pattern's pressed state](https://www.w3.org/WAI/ARIA/apg/patterns/button/):
 * a toggle button IS a button, just one that stays visually/semantically
 * "pressed" after activation (a bold/italic formatting button is the
 * canonical example) rather than a distinct switch/checkbox-like control.
 * Unlike `Switch`/`Checkbox`, there's no hidden native input for form
 * participation — a toggle button doesn't represent a value a `<form>`
 * submits, the way a checkbox or switch does.
 *
 * @example
 * ```tsx
 * const [bold, setBold] = useState(false);
 * <Toggle pressed={bold} onPressedChange={setBold} aria-label="Bold">
 *   <BoldIcon />
 * </Toggle>
 * ```
 */
const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>((props, forwardedRef) => {
  const {
    pressed: pressedProp,
    defaultPressed = false,
    onPressedChange,
    disabled = false,
    onClick,
    ...rest
  } = props;

  const [pressed, setPressed] = useControllableState<boolean>({
    prop: pressedProp,
    defaultProp: defaultPressed,
    onChange: onPressedChange,
  });

  return (
    <Primitive
      as="button"
      type="button"
      aria-pressed={pressed}
      data-state={pressed ? 'on' : 'off'}
      data-disabled={disabled ? '' : undefined}
      disabled={disabled}
      {...rest}
      ref={forwardedRef}
      onClick={composeEventHandlers(onClick, () => {
        if (!disabled) setPressed(!pressed);
      })}
    />
  );
});

Toggle.displayName = 'Toggle';

export { Toggle };
export type { ToggleProps };
