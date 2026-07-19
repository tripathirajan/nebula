import { createContextScope } from '@nebula-lab/primitives/create-context-scope';

import type { Scope } from '@nebula-lab/primitives/create-context-scope';

interface OTPInputContextValue {
  value: string;
  /** Splices `text` into `value` starting at `startIndex` (truncated to `length` total characters), then focuses whichever slot ends up right after the inserted text — the one shared operation both a single slot's `onChange` (typing or a single-slot paste) and a full clipboard paste funnel through. */
  setValueRange: (startIndex: number, text: string) => void;
  length: number;
  disabled: boolean;
  name: string | undefined;
  registerSlotRef: (index: number, element: HTMLInputElement | null) => void;
  focusSlot: (index: number) => void;
}

const OTP_INPUT_NAME = 'OTPInput';

/**
 * Scoped context factory for OTPInput — mirrors every other compound
 * component's use of `createContextScope`.
 */
const [createOTPInputContext, createOTPInputScope] = createContextScope(OTP_INPUT_NAME);
const [OTPInputProvider, useOTPInputContext] =
  createOTPInputContext<OTPInputContextValue>(OTP_INPUT_NAME);

/** Every consumer prop object accepts an optional internal `__scopeOTPInput` prop threaded through by `createOTPInputScope` — not part of the public API. */
type ScopedProps<P> = P & { __scopeOTPInput?: Scope<OTPInputContextValue> };

export { OTP_INPUT_NAME, OTPInputProvider, useOTPInputContext, createOTPInputScope };
export type { OTPInputContextValue, ScopedProps };
