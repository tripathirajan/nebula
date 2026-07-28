import { OTPInput as HeadlessOTPInput } from '@nebula-lab/headless/otp-input';
import { cn } from '@nebula-lab/primitives/cn';
import * as React from 'react';

import type { OTPInputProps as HeadlessOTPInputProps } from '@nebula-lab/headless/otp-input';

/**
 * The headless root has no `className` of its own — it renders no DOM at
 * all (just context/state, see the headless source), so the layout div
 * this wrapper adds is a genuinely new element, not a passthrough onto an
 * existing one, unlike every other wrapper in this batch.
 */
type OTPInputProps = HeadlessOTPInputProps & { className?: string };

/** Lays out its `OTPInputSlot`s in a row — all the auto-advance/backspace/paste-splicing behavior comes unchanged from the headless source. */
const OTPInput = React.forwardRef<HTMLDivElement, OTPInputProps>((props, forwardedRef) => {
  const { className, ...rest } = props;
  return (
    <div className={cn('flex items-center gap-2', className)} ref={forwardedRef}>
      <HeadlessOTPInput {...rest} />
    </div>
  );
});

OTPInput.displayName = 'OTPInput';

export { OTPInput };
export type { OTPInputProps };
