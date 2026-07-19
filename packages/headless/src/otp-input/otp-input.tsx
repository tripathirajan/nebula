import { useControllableState } from '@nebula-lab/hooks';
import * as React from 'react';

import { OTPInputProvider } from './otp-input-context';

import type { ScopedProps } from './otp-input-context';

interface OTPInputProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Total number of slots/characters, e.g. `6` for a 6-digit code. */
  length: number;
  disabled?: boolean;
  /** Forwarded to a visually-hidden native input mirroring the full code, for `<form>` submission. */
  name?: string;
  children?: React.ReactNode;
}

/**
 * Root of the OTPInput compound component — a segmented one-time-passcode
 * field, one real `<input maxLength={1}>` per {@link OTPInputSlot}. Typing a
 * character auto-advances to the next slot; Backspace on an empty slot
 * moves back to the previous one; pasting a full code into any slot
 * distributes it across the remaining slots from that point on — all
 * funneled through this root's `setValueRange`, so there's exactly one place
 * that decides how a multi-character input event (typing fast enough to
 * land two characters in one `onChange`, or an actual clipboard paste)
 * splices into the overall value.
 *
 * @example
 * ```tsx
 * <OTPInput length={6} name="code">
 *   {Array.from({ length: 6 }, (_, index) => (
 *     <OTPInputSlot key={index} index={index} />
 *   ))}
 * </OTPInput>
 * ```
 */
function OTPInput(props: ScopedProps<OTPInputProps>) {
  const {
    __scopeOTPInput,
    value: valueProp,
    defaultValue = '',
    onValueChange,
    length,
    disabled = false,
    name,
    children,
  } = props;

  const [value, setValue] = useControllableState<string>({
    prop: valueProp,
    defaultProp: defaultValue,
    onChange: onValueChange,
  });

  const slotRefs = React.useRef<Map<number, HTMLInputElement>>(new Map());

  const focusSlot = React.useCallback((index: number) => {
    slotRefs.current.get(index)?.focus();
  }, []);

  const registerSlotRef = React.useCallback((index: number, element: HTMLInputElement | null) => {
    if (element) slotRefs.current.set(index, element);
    else slotRefs.current.delete(index);
  }, []);

  const setValueRange = React.useCallback(
    (startIndex: number, text: string) => {
      setValue((current) => {
        const currentValue = current ?? '';
        const chars = currentValue.padEnd(length, ' ').split('');
        if (text.length === 0) {
          // Explicitly clearing this one slot (e.g. Backspace) — there's no
          // character to "insert", but `insertChars.forEach` below iterates
          // zero times for an empty string, so without this the slot's old
          // character was never actually erased.
          chars[startIndex] = ' ';
        } else {
          const insertChars = text.split('').slice(0, length - startIndex);
          insertChars.forEach((char, offset) => {
            chars[startIndex + offset] = char;
          });
        }
        return chars.join('').trimEnd();
      });
      const nextIndex = Math.min(startIndex + text.length, length - 1);
      focusSlot(nextIndex);
    },
    [setValue, length, focusSlot],
  );

  return (
    <OTPInputProvider
      scope={__scopeOTPInput}
      value={value ?? ''}
      setValueRange={setValueRange}
      length={length}
      disabled={disabled}
      name={name}
      registerSlotRef={registerSlotRef}
      focusSlot={focusSlot}
    >
      {children}
    </OTPInputProvider>
  );
}

export { OTPInput };
export type { OTPInputProps };
