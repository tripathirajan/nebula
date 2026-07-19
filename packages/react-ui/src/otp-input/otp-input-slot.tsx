import { OTPInputSlot as HeadlessOTPInputSlot } from '@nebula-lab/headless/otp-input';
import { cn } from '@nebula-lab/primitives/cn';
import * as React from 'react';

import type { OTPInputSlotProps as HeadlessOTPInputSlotProps } from '@nebula-lab/headless/otp-input';

type OTPInputSlotProps = HeadlessOTPInputSlotProps;

/** Built on `@nebula-lab/primitives`' bare `Input` (see the headless source), same `--input-*` treatment `ColorPickerHexInput`/`NumberInputField` apply directly for the same reason, sized/centered as one square digit box. */
const OTPInputSlot = React.forwardRef<HTMLInputElement, OTPInputSlotProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <HeadlessOTPInputSlot
        className={cn(
          'h-10 w-10 rounded-[var(--radius-field)] border border-[var(--input-border)] bg-[var(--input-bg)] text-center text-lg font-medium text-[var(--input-text)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--input-ring)] focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...rest}
        ref={forwardedRef}
      />
    );
  },
);

OTPInputSlot.displayName = 'OTPInputSlot';

export { OTPInputSlot };
export type { OTPInputSlotProps };
