
import { useControllableState } from '@nebula/hooks';
import { composeEventHandlers } from '@nebula/primitives/compose-event-handlers';
import { useComposedRefs } from '@nebula/primitives/compose-refs';
import { Primitive } from '@nebula/primitives/primitive';
import { VisuallyHidden } from '@nebula/primitives/visually-hidden';
import * as React from 'react';

import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';

type CheckedState = boolean | 'indeterminate';

interface CheckboxProps extends Omit<PrimitivePropsWithRef<'button'>, 'checked' | 'defaultChecked'> {
  /** Controlled: `true`/`false`/`'indeterminate'` (a third, non-interactive visual state). */
  checked?: CheckedState;
  /** Uncontrolled initial state. @default false */
  defaultChecked?: CheckedState;
  onCheckedChange?: (checked: CheckedState) => void;
  disabled?: boolean;
  /** Forwarded to a hidden native `<input type="checkbox">` so this participates in native `<form>` submission. */
  name?: string;
  value?: string;
  required?: boolean;
}

/**
 * `role="checkbox"` — a `button`, not a native `<input type="checkbox">`, so
 * `@nebula/react-ui` can fully style the check mark instead of fighting
 * browser-native checkbox rendering. A visually-hidden native checkbox
 * mirrors the state underneath for free `<form>` participation (name/value
 * submission, browser autofill, constraint validation) — the same technique
 * `Switch` and native-input-averse libraries like Radix use.
 *
 * Tri-state: `checked` accepts `'indeterminate'` for a "some but not all
 * children selected" visual (e.g. a parent checkbox over a list) — Space
 * still toggles it, always resolving to `true`/`false`, matching native
 * `<input>` behavior (indeterminate is visual-only, never a value a user can
 * navigate *back* to via interaction).
 *
 * @example
 * ```tsx
 * const [checked, setChecked] = useState<boolean | 'indeterminate'>(false);
 * <Checkbox checked={checked} onCheckedChange={setChecked} name="terms" value="accepted" />
 * ```
 */
const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>((props, forwardedRef) => {
  const {
    checked: checkedProp,
    defaultChecked,
    onCheckedChange,
    disabled = false,
    name,
    value = 'on',
    required,
    onClick,
    onKeyDown,
    ...rest
  } = props;

  const [checked, setChecked] = useControllableState<CheckedState>({
    prop: checkedProp,
    defaultProp: defaultChecked ?? false,
    onChange: onCheckedChange,
  });

  const inputRef = React.useRef<HTMLInputElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const composedRef = useComposedRefs(forwardedRef, buttonRef);

  // Keep the native input's `checked` in sync with our state on every
  // render (imperatively, not via a React `checked` prop) — it's
  // deliberately uncontrolled from React's point of view so calling
  // `.click()` on it below toggles from the right starting value.
  React.useEffect(() => {
    const input = inputRef.current;
    if (input) input.checked = checked === true;
  }, [checked]);

  const toggle = () => {
    if (disabled) return;
    const next = checked === 'indeterminate' ? true : !checked;
    setChecked(next);
    // Call the real DOM `.click()` method rather than hand-rolling a
    // dispatched event — it toggles the input's `checked` AND fires genuine
    // bubbling `click`/`input`/`change` events in the browser's own order,
    // which is what form libraries (react-hook-form, Formik, plain
    // `<form>`/`FormData`) actually listen for. Our own button's click
    // never touches this hidden input directly, so nothing else would
    // otherwise tell an ancestor form the value changed.
    inputRef.current?.click();
  };

  return (
    <>
      <Primitive
        as="button"
        type="button"
        role="checkbox"
        aria-checked={checked === 'indeterminate' ? 'mixed' : checked}
        aria-required={required || undefined}
        data-state={checked === 'indeterminate' ? 'indeterminate' : checked ? 'checked' : 'unchecked'}
        data-disabled={disabled ? '' : undefined}
        disabled={disabled}
        {...rest}
        ref={composedRef}
        onClick={composeEventHandlers(onClick, toggle)}
        onKeyDown={composeEventHandlers(onKeyDown, (event) => {
          // Space is the only native activation key for a checkbox — unlike
          // a button, Enter should NOT toggle it (matches native <input>).
          if (event.key === ' ') {
            event.preventDefault();
            toggle();
          }
        })}
      />
      <VisuallyHidden as="span">
        {/* Deliberately uncontrolled (`defaultChecked`, not `checked`) — its
            `checked` is driven imperatively (see the effect above and
            `toggle`'s `.click()` call), not by React reconciliation, so
            there's nothing for a `checked`-without-`onChange` warning to
            complain about. */}
        <input
          type="checkbox"
          ref={inputRef}
          defaultChecked={checked === true}
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

Checkbox.displayName = 'Checkbox';

export { Checkbox };
export type { CheckboxProps, CheckedState };
