import { cn } from '@nebula/primitives/cn';
import { ColorPickerTrigger as StylelessColorPickerTrigger } from '@nebula/styleless/color-picker';
import * as React from 'react';

import type { ColorPickerTriggerProps as StylelessColorPickerTriggerProps } from '@nebula/styleless/color-picker';

type ColorPickerTriggerProps = StylelessColorPickerTriggerProps;

/**
 * The swatch button — unlike `PopoverTrigger`/`MenuTrigger` (typically an
 * already-styled element passed `asChild`), this one needs its own chrome:
 * the background color it displays *is* the current value (set inline by
 * the styleless source), so this only adds the border/rounding/focus-ring
 * frame around that color, not a fill of its own.
 */
const ColorPickerTrigger = React.forwardRef<HTMLButtonElement, ColorPickerTriggerProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <StylelessColorPickerTrigger
        className={cn(
          'h-8 w-8 rounded-[var(--radius-selector)] border border-[var(--color-picker-swatch-border)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-picker-swatch-border)] focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...rest}
        ref={forwardedRef}
      />
    );
  },
);

ColorPickerTrigger.displayName = 'ColorPickerTrigger';

export { ColorPickerTrigger };
export type { ColorPickerTriggerProps };
