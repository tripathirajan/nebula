import { cn } from '@nebula/primitives/cn';
import * as React from 'react';

import { Input } from '../input/input';

import type { InputProps } from '../input/input';

type PasswordFieldProps = Omit<InputProps, 'type'>;

/**
 * A password `Input` with a built-in show/hide toggle — a genuinely new
 * component (no `@nebula/headless` counterpart the way `Select`/`Combobox`
 * have; the visibility toggle is a `react-ui`-layer-only affordance, not
 * ARIA-behavior worth decoupling into an unstyled layer of its own). Local
 * `visible` state starts `false` (masked); toggling it swaps the underlying
 * native `<input>`'s `type` between `"password"`/`"text"` rather than
 * hiding/revealing text via CSS, so password managers and browser autofill
 * still recognize the field correctly regardless of the current toggle
 * state.
 *
 * @example
 * ```tsx
 * <PasswordField name="password" placeholder="Password" />
 * ```
 */
const PasswordField = React.forwardRef<HTMLInputElement, PasswordFieldProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    const [visible, setVisible] = React.useState(false);

    return (
      <div className="relative">
        <Input
          type={visible ? 'text' : 'password'}
          className={cn('pr-10', className)}
          {...rest}
          ref={forwardedRef}
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          aria-pressed={visible}
          tabIndex={-1}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-[var(--radius-selector)] p-1 text-[var(--input-text)]/60 outline-none hover:text-[var(--input-text)] focus-visible:ring-2 focus-visible:ring-[var(--input-ring)]"
        >
          {visible ? (
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.6 21.6 0 0 1 5.06-6.06M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a21.7 21.7 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
              <path d="m1 1 22 22" />
            </svg>
          ) : (
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
              <circle cx={12} cy={12} r={3} />
            </svg>
          )}
        </button>
      </div>
    );
  },
);

PasswordField.displayName = 'PasswordField';

export { PasswordField };
export type { PasswordFieldProps };
