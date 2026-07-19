
import { useControllableState } from '@nebula-lab/hooks';
import { composeEventHandlers } from '@nebula-lab/primitives/compose-event-handlers';
import { useComposedRefs } from '@nebula-lab/primitives/compose-refs';
import { Primitive } from '@nebula-lab/primitives/primitive';
import { VisuallyHidden } from '@nebula-lab/primitives/visually-hidden';
import * as React from 'react';

import type { PrimitivePropsWithRef } from '@nebula-lab/primitives/primitive';

interface SwitchProps extends Omit<PrimitivePropsWithRef<'button'>, 'checked' | 'defaultChecked'> {
  /** Controlled on/off state. */
  checked?: boolean;
  /** Uncontrolled initial state. @default false */
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  /** Forwarded to a hidden native `<input type="checkbox">` so this participates in native `<form>` submission. */
  name?: string;
  value?: string;
  required?: boolean;
}

/**
 * `role="switch"` — like {@link Checkbox} (a `button` + a visually-hidden
 * native `<input type="checkbox">` for form participation), but semantically
 * an on/off toggle rather than a selectable option: screen readers announce
 * "on"/"off" instead of "checked"/"unchecked", per the WAI-ARIA
 * [Switch pattern](https://www.w3.org/WAI/ARIA/apg/patterns/switch/). No
 * tri-state — a switch is always fully on or off.
 *
 * @example
 * ```tsx
 * const [enabled, setEnabled] = useState(false);
 * <Switch checked={enabled} onCheckedChange={setEnabled} aria-label="Enable notifications" />
 * ```
 */
const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>((props, forwardedRef) => {
  const {
    checked: checkedProp,
    defaultChecked = false,
    onCheckedChange,
    disabled = false,
    name,
    value = 'on',
    required,
    onClick,
    onKeyDown,
    ...rest
  } = props;

  const [checked, setChecked] = useControllableState<boolean>({
    prop: checkedProp,
    defaultProp: defaultChecked,
    onChange: onCheckedChange,
  });

  const inputRef = React.useRef<HTMLInputElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const composedRef = useComposedRefs(forwardedRef, buttonRef);

  React.useEffect(() => {
    const input = inputRef.current;
    if (input) input.checked = checked;
  }, [checked]);

  const toggle = () => {
    if (disabled) return;
    setChecked(!checked);
    inputRef.current?.click();
  };

  return (
    <>
      <Primitive
        as="button"
        type="button"
        role="switch"
        aria-checked={checked}
        aria-required={required || undefined}
        data-state={checked ? 'checked' : 'unchecked'}
        data-disabled={disabled ? '' : undefined}
        disabled={disabled}
        {...rest}
        ref={composedRef}
        onClick={composeEventHandlers(onClick, toggle)}
        onKeyDown={composeEventHandlers(onKeyDown, (event) => {
          if (event.key === ' ') {
            event.preventDefault();
            toggle();
          }
        })}
      />
      <VisuallyHidden as="span">
        <input
          type="checkbox"
          ref={inputRef}
          defaultChecked={checked}
          aria-hidden="true"
          tabIndex={-1}
          name={name}
          value={value}
          disabled={disabled}
          required={required}
        />
      </VisuallyHidden>
    </>
  );
});

Switch.displayName = 'Switch';

export { Switch };
export type { SwitchProps };
