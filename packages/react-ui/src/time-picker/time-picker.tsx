import { cn } from '@nebula/primitives/cn';
import * as React from 'react';

import { Input } from '../input/input';

import type { InputProps } from '../input/input';

type TimePickerProps = Omit<InputProps, 'type'>;

/**
 * An `Input` preset to `type="time"` — same "`react-ui`-layer-only
 * convenience, no `@nebula/styleless` counterpart" reasoning `SearchField`/
 * `PasswordField` document: a native `type="time"` input already gives a
 * fully keyboard-operable, locale-aware (12h/24h per the user's own OS
 * setting) time-entry UI for free, including the platform's own picker
 * affordance on browsers/devices that render one — there's no independent
 * ARIA behavior left to add, only a themed frame around it (plus a small
 * decorative clock icon, purely visual — `aria-hidden`, since the native
 * input's own accessible name/value already fully describes it).
 *
 * Deliberately not a custom hour/minute-select-built-from-scratch widget:
 * that would forgo the native input's built-in locale formatting and
 * platform picker for no real accessibility gain, the same trade-off
 * `SearchField` documents for its own native `type="search"` choice.
 *
 * @example
 * ```tsx
 * <TimePicker defaultValue="14:30" />
 * ```
 */
const TimePicker = React.forwardRef<HTMLInputElement, TimePickerProps>((props, forwardedRef) => {
  const { className, ...rest } = props;
  return (
    <div className="relative">
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--input-text)]/50"
      >
        <circle cx={12} cy={12} r={9} />
        <path d="M12 7v5l3 3" />
      </svg>
      <Input type="time" className={cn('pl-9', className)} {...rest} ref={forwardedRef} />
    </div>
  );
});

TimePicker.displayName = 'TimePicker';

export { TimePicker };
export type { TimePickerProps };
