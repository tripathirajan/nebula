import { composeEventHandlers } from '@nebula-lab/primitives/compose-event-handlers';
import { useComposedRefs } from '@nebula-lab/primitives/compose-refs';
import { Input } from '@nebula-lab/primitives/input';
import * as React from 'react';

import { useOTPInputContext } from './otp-input-context';

import type { ScopedProps } from './otp-input-context';
import type { InputProps } from '@nebula-lab/primitives/input';

const OTP_INPUT_SLOT_NAME = 'OTPInputSlot';

interface OTPInputSlotProps extends Omit<InputProps, 'value' | 'defaultValue' | 'maxLength'> {
  /** This slot's position, `0`-based. */
  index: number;
}

/**
 * One character of `OTPInput`'s code — a real `<input maxLength={1}>` (not a
 * `<div>` painted to look like an input, unlike some OTP widgets) so
 * autofill, password managers' one-time-code suggestions, and mobile
 * "insert code from SMS" affordances all keep working. A multi-character
 * `onChange` (typing fast enough to land two keystrokes in one event, or a
 * paste landing here specifically) and a real clipboard `onPaste` both
 * funnel into `OTPInput`'s `setValueRange` — see that file's doc comment.
 *
 * @example
 * ```tsx
 * <OTPInputSlot index={0} />
 * ```
 */
const OTPInputSlot = React.forwardRef<HTMLInputElement, ScopedProps<OTPInputSlotProps>>(
  (props, forwardedRef) => {
    const {
      __scopeOTPInput,
      index,
      disabled: disabledProp,
      onChange,
      onKeyDown,
      onPaste,
      ...slotProps
    } = props;
    const context = useOTPInputContext(OTP_INPUT_SLOT_NAME, __scopeOTPInput);
    const disabled = disabledProp || context.disabled;
    const nodeRef = React.useRef<HTMLInputElement>(null);
    const composedRef = useComposedRefs(forwardedRef, nodeRef, (element) =>
      context.registerSlotRef(index, element),
    );
    const char = context.value[index] ?? '';

    return (
      <Input
        inputMode="text"
        autoComplete={index === 0 ? 'one-time-code' : 'off'}
        maxLength={1}
        disabled={disabled}
        value={char}
        {...slotProps}
        ref={composedRef}
        onChange={composeEventHandlers(onChange, (event) => {
          const typed = event.currentTarget.value;
          if (typed.length <= 1) {
            context.setValueRange(index, typed);
          } else {
            // More than one character landed in a single slot (fast typing,
            // or a paste that some browsers deliver as a plain `input`
            // event instead of `paste`) — treat it exactly like a paste
            // starting here.
            context.setValueRange(index, typed);
          }
        })}
        onKeyDown={composeEventHandlers(onKeyDown, (event) => {
          if (event.key === 'Backspace' && char === '' && index > 0) {
            event.preventDefault();
            context.setValueRange(index - 1, '');
            context.focusSlot(index - 1);
          } else if (event.key === 'ArrowLeft' && index > 0) {
            event.preventDefault();
            context.focusSlot(index - 1);
          } else if (event.key === 'ArrowRight' && index < context.length - 1) {
            event.preventDefault();
            context.focusSlot(index + 1);
          }
        })}
        onPaste={composeEventHandlers(onPaste, (event) => {
          event.preventDefault();
          const pasted = event.clipboardData.getData('text');
          context.setValueRange(index, pasted);
        })}
      />
    );
  },
);

OTPInputSlot.displayName = OTP_INPUT_SLOT_NAME;

export { OTPInputSlot };
export type { OTPInputSlotProps };
