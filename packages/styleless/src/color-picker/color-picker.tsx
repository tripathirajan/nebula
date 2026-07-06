import { useControllableState } from '@nebula/hooks';
import * as React from 'react';

import { Popover } from '../popover/popover';

import { ColorPickerProvider } from './color-picker-context';

import type { ScopedProps } from './color-picker-context';

interface ColorPickerProps {
  /** A `#rgb`/`#rrggbb` hex string. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  children?: React.ReactNode;
}

/**
 * Root of the ColorPicker compound component — a swatch button
 * (`ColorPickerTrigger`) that opens a `Popover` (reused directly, the same
 * "mint one ambient instance" reuse `MenubarMenu` makes of `Menu`) containing
 * whatever channel controls the consumer composes, plus a built-in
 * `ColorPickerHexInput` for direct hex entry.
 *
 * There's no ARIA APG pattern for "color picker" to follow exactly (it's
 * genuinely bespoke UI) — this first pass deliberately covers the
 * keyboard/screen-reader-accessible surface (a swatch trigger + a real,
 * validated hex `<input>`) rather than also shipping a 2D
 * saturation/brightness drag square, which is mouse-only by nature anyway
 * and is left as a `react-ui`-layer visual enhancement to add on top later.
 *
 * @example
 * ```tsx
 * <ColorPicker defaultValue="#3b82f6">
 *   <ColorPickerTrigger aria-label="Pick a color" />
 *   <ColorPickerPortal>
 *     <ColorPickerContent>
 *       <ColorPickerHexInput aria-label="Hex color" />
 *     </ColorPickerContent>
 *   </ColorPickerPortal>
 * </ColorPicker>
 * ```
 */
function ColorPicker(props: ScopedProps<ColorPickerProps>) {
  const {
    __scopeColorPicker,
    value: valueProp,
    defaultValue = '#000000',
    onValueChange,
    open,
    defaultOpen,
    onOpenChange,
    disabled = false,
    children,
  } = props;

  const [value, setValue] = useControllableState<string>({
    prop: valueProp,
    defaultProp: defaultValue,
    onChange: onValueChange,
  });

  return (
    <Popover open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <ColorPickerProvider
        scope={__scopeColorPicker}
        value={value ?? defaultValue}
        onValueChange={setValue}
        disabled={disabled}
      >
        {children}
      </ColorPickerProvider>
    </Popover>
  );
}

export { ColorPicker };
export type { ColorPickerProps };
