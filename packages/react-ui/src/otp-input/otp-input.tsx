import { cn } from '@nebula/primitives/cn';
import { OTPInput as StylelessOTPInput } from '@nebula/styleless/otp-input';
import * as React from 'react';

import type { OTPInputProps as StylelessOTPInputProps } from '@nebula/styleless/otp-input';

/**
 * The styleless root has no `className` of its own — it renders no DOM at
 * all (just context/state, see the styleless source), so the layout div
 * this wrapper adds is a genuinely new element, not a passthrough onto an
 * existing one, unlike every other wrapper in this batch.
 */
type OTPInputProps = StylelessOTPInputProps & { className?: string };

/** Lays out its `OTPInputSlot`s in a row — all the auto-advance/backspace/paste-splicing behavior comes unchanged from the styleless source. */
const OTPInput = React.forwardRef<HTMLDivElement, OTPInputProps>((props, forwardedRef) => {
  const { className, ...rest } = props;
  return (
    <div className={cn('flex items-center gap-2', className)} ref={forwardedRef}>
      <StylelessOTPInput {...rest} />
    </div>
  );
});

OTPInput.displayName = 'OTPInput';

export { OTPInput };
export type { OTPInputProps };
