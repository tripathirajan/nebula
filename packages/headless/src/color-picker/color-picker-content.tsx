import * as React from 'react';

import { PopoverContent } from '../popover/popover-content';

import type { PopoverContentProps } from '../popover/popover-content';

const COLOR_PICKER_CONTENT_NAME = 'ColorPickerContent';

type ColorPickerContentProps = PopoverContentProps;

/**
 * Thin wrapper over `PopoverContent` — no ColorPicker-specific behavior on
 * top, just a renamed entry point so consumers reach for
 * `ColorPickerContent` rather than an unrelated-looking `PopoverContent`
 * import.
 *
 * @example
 * ```tsx
 * <ColorPickerContent side="bottom" align="start">
 *   <ColorPickerHexInput aria-label="Hex color" />
 * </ColorPickerContent>
 * ```
 */
const ColorPickerContent = React.forwardRef<HTMLDivElement, ColorPickerContentProps>(
  (props, forwardedRef) => <PopoverContent {...props} ref={forwardedRef} />,
);

ColorPickerContent.displayName = COLOR_PICKER_CONTENT_NAME;

export { ColorPickerContent };
export type { ColorPickerContentProps };
