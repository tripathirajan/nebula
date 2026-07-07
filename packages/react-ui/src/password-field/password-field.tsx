import { cn } from '@nebula/primitives/cn';
import { PasswordInput as StylelessPasswordInput } from '@nebula/styleless/password-input';
import * as React from 'react';

import { inputClassName } from '../input/input';

import type { PasswordInputProps as StylelessPasswordInputProps } from '@nebula/styleless/password-input';

type PasswordFieldProps = StylelessPasswordInputProps;

/**
 * Wraps `@nebula/styleless`'s `PasswordInput` (which owns the real
 * behavior: `visible` state, `type="password"|"text"` swapping,
 * `aria-pressed` wiring) and supplies the eye/eye-off icon pair via
 * `renderToggle` plus the `absolute`-positioned toggle button styling via
 * `toggleClassName` — this file's whole job is visual, matching every
 * other `react-ui` wrapper's division of labor with its `styleless`
 * counterpart.
 *
 * @example
 * ```tsx
 * <PasswordField name="password" placeholder="Password" />
 * ```
 */
const PasswordField = React.forwardRef<HTMLInputElement, PasswordFieldProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;

    return (
      <div className="relative">
        <StylelessPasswordInput
          className={cn(inputClassName, 'pr-10', className)}
          toggleClassName="absolute right-2 top-1/2 -translate-y-1/2 rounded-[var(--radius-selector)] p-1 text-[var(--input-text)]/60 outline-none hover:text-[var(--input-text)] focus-visible:ring-2 focus-visible:ring-[var(--input-ring)]"
          renderToggle={(visible) =>
            visible ? (
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
            )
          }
          {...rest}
          ref={forwardedRef}
        />
      </div>
    );
  },
);

PasswordField.displayName = 'PasswordField';

export { PasswordField };
export type { PasswordFieldProps };
