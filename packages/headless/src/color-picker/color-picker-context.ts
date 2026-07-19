import { createContextScope } from '@nebula-lab/primitives/create-context-scope';

import type { Scope } from '@nebula-lab/primitives/create-context-scope';

interface ColorPickerContextValue {
  /** A `#rgb`/`#rrggbb` hex string. */
  value: string;
  onValueChange: (value: string) => void;
  disabled: boolean;
}

const COLOR_PICKER_NAME = 'ColorPicker';

/**
 * Scoped context factory for ColorPicker. Unlike `Select`/`ColorPicker`'s
 * sibling `Combobox`, this doesn't compose `Popper`'s scope directly —
 * `ColorPicker` mints one ambient, unscoped `Popover` internally (see
 * `color-picker.tsx`) the same way `MenubarMenu` mints an ambient `Menu`, so
 * there's only ever one `Popover` instance per `ColorPicker` and no nested
 * `Popper`-scoping concern to thread through.
 */
const [createColorPickerContext, createColorPickerScope] = createContextScope(COLOR_PICKER_NAME);
const [ColorPickerProvider, useColorPickerContext] =
  createColorPickerContext<ColorPickerContextValue>(COLOR_PICKER_NAME);

/** Every consumer prop object accepts an optional internal `__scopeColorPicker` prop threaded through by `createColorPickerScope` — not part of the public API. */
type ScopedProps<P> = P & { __scopeColorPicker?: Scope<ColorPickerContextValue> };

export { COLOR_PICKER_NAME, ColorPickerProvider, useColorPickerContext, createColorPickerScope };
export type { ColorPickerContextValue, ScopedProps };
