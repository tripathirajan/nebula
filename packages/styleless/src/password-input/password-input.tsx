import * as React from 'react';

import { Input } from '../input/input';

import type { InputProps } from '../input/input';

/** Props accepted by {@link PasswordInput}. */
interface PasswordInputProps extends Omit<InputProps, 'type'> {
  /** Labels the show/hide toggle when the field is currently masked. Defaults to "Show password". */
  showLabel?: string;
  /** Labels the show/hide toggle when the field is currently revealed. Defaults to "Hide password". */
  hideLabel?: string;
  /**
   * Custom toggle button content (typically an eye/eye-off icon pair)
   * instead of the default text label — receives the current visibility
   * state. Left as a render prop rather than `children` so this component
   * can render both the `<input>` and the toggle `<button>` from one call
   * site, matching how `IconButton` takes its icon as `children`.
   */
  renderToggle?: (visible: boolean) => React.ReactNode;
  /** Passed straight through to the toggle `<button>` — e.g. for `react-ui`'s absolute positioning/styling classes. */
  toggleClassName?: string;
}

/**
 * `styleless`-tier `PasswordInput` — the real behavior extracted from
 * `@nebula-lab/react-ui`'s `PasswordField`: a password `Input` with a show/hide
 * toggle button. Local `visible` state starts `false` (masked); toggling it
 * swaps the underlying native `<input>`'s `type` between
 * `"password"`/`"text"` rather than hiding/revealing text via CSS, so
 * password managers and browser autofill still recognize the field
 * correctly regardless of the current toggle state. No icon and no
 * positioning classes here by default — `react-ui`'s version supplies the
 * eye/eye-off icon via `renderToggle` and `absolute`-positions it via
 * `toggleClassName`; this layer's job is only the `visible` state machine
 * and correct `aria-pressed`/`type` wiring.
 *
 * @example
 * ```tsx
 * <PasswordInput name="password" />
 * ```
 */
const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  (props, forwardedRef) => {
    const {
      showLabel = 'Show password',
      hideLabel = 'Hide password',
      renderToggle,
      toggleClassName,
      ...rest
    } = props;
    const [visible, setVisible] = React.useState(false);
    const label = visible ? hideLabel : showLabel;

    return (
      <>
        <Input type={visible ? 'text' : 'password'} {...rest} ref={forwardedRef} />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={label}
          aria-pressed={visible}
          tabIndex={-1}
          className={toggleClassName}
        >
          {renderToggle ? renderToggle(visible) : label}
        </button>
      </>
    );
  },
);

PasswordInput.displayName = 'PasswordInput';

export { PasswordInput };
export type { PasswordInputProps };
