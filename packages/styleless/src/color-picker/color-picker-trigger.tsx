import { Primitive } from '@nebula/primitives/primitive';
import { VisuallyHidden } from '@nebula/primitives/visually-hidden';
import * as React from 'react';

import { PopoverTrigger } from '../popover/popover-trigger';

import { useColorPickerContext } from './color-picker-context';

import type { ScopedProps } from './color-picker-context';
import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';

const COLOR_PICKER_TRIGGER_NAME = 'ColorPickerTrigger';

type ColorPickerTriggerProps = PrimitivePropsWithRef<'button'>;

/**
 * A swatch button (background color set to the current `value`) that opens
 * `ColorPickerContent` — built on `PopoverTrigger`, so it inherits
 * `aria-haspopup`/`aria-expanded`/`aria-controls` and toggle-on-click for
 * free. Always pass an `aria-label` — a plain color swatch has no visible
 * text naming it.
 *
 * @example
 * ```tsx
 * <ColorPickerTrigger aria-label="Pick a color" />
 * ```
 */
const ColorPickerTrigger = React.forwardRef<HTMLButtonElement, ScopedProps<ColorPickerTriggerProps>>(
  (props, forwardedRef) => {
    const { __scopeColorPicker, style, children, ...triggerProps } = props;
    const context = useColorPickerContext(COLOR_PICKER_TRIGGER_NAME, __scopeColorPicker);

    return (
      <PopoverTrigger
        disabled={context.disabled}
        style={{ ...style, backgroundColor: context.value }}
        {...triggerProps}
        ref={forwardedRef}
      >
        <Primitive as="span" aria-hidden="true">
          {children}
        </Primitive>
        <VisuallyHidden>{context.value}</VisuallyHidden>
      </PopoverTrigger>
    );
  },
);

ColorPickerTrigger.displayName = COLOR_PICKER_TRIGGER_NAME;

export { ColorPickerTrigger };
export type { ColorPickerTriggerProps };
