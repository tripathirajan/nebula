import { composeEventHandlers } from '@nebula/primitives/compose-event-handlers';
import { Input } from '@nebula/primitives/input';
import * as React from 'react';

import { useColorPickerContext } from './color-picker-context';

import type { ScopedProps } from './color-picker-context';
import type { InputProps } from '@nebula/primitives/input';

const COLOR_PICKER_HEX_INPUT_NAME = 'ColorPickerHexInput';

type ColorPickerHexInputProps = Omit<InputProps, 'value' | 'defaultValue' | 'type'>;

const HEX_PATTERN = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

/**
 * A real, validated text `<input>` for typing a hex color directly —
 * deliberately kept as a genuine text field rather than a custom
 * canvas-based picker, so it's fully keyboard/screen-reader accessible on
 * its own even before any visual channel controls are added. Local text
 * state is kept separate from `ColorPicker`'s committed `value` so a
 * partially-typed, momentarily-invalid string (e.g. `"#3b8"` mid-keystroke
 * toward `"#3b82f6"`) doesn't get clobbered by the last valid value on every
 * keystroke — `onValueChange` only fires once the full string matches
 * `HEX_PATTERN`, and blurring with an invalid value reverts the field back
 * to the last committed one.
 *
 * @example
 * ```tsx
 * <ColorPickerHexInput aria-label="Hex color" />
 * ```
 */
const ColorPickerHexInput = React.forwardRef<HTMLInputElement, ScopedProps<ColorPickerHexInputProps>>(
  (props, forwardedRef) => {
    const { __scopeColorPicker, onChange, onBlur, disabled: disabledProp, ...inputProps } = props;
    const context = useColorPickerContext(COLOR_PICKER_HEX_INPUT_NAME, __scopeColorPicker);
    const disabled = disabledProp || context.disabled;
    const [text, setText] = React.useState(context.value);

    React.useEffect(() => {
      setText(context.value);
    }, [context.value]);

    return (
      <Input
        type="text"
        inputMode="text"
        spellCheck={false}
        aria-invalid={!HEX_PATTERN.test(text) || undefined}
        disabled={disabled}
        value={text}
        {...inputProps}
        ref={forwardedRef}
        onChange={composeEventHandlers(onChange, (event) => {
          const next = event.currentTarget.value;
          setText(next);
          if (HEX_PATTERN.test(next)) context.onValueChange(next);
        })}
        onBlur={composeEventHandlers(onBlur, () => {
          if (!HEX_PATTERN.test(text)) setText(context.value);
        })}
      />
    );
  },
);

ColorPickerHexInput.displayName = COLOR_PICKER_HEX_INPUT_NAME;

export { ColorPickerHexInput };
export type { ColorPickerHexInputProps };
