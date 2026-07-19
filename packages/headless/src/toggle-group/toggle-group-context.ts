import { createContextScope } from '@nebula-lab/primitives/create-context-scope';

import type { Scope } from '@nebula-lab/primitives/create-context-scope';
import type { RovingFocusGroupOrientation } from '@nebula-lab/primitives/roving-focus-group';

interface ToggleGroupContextValue {
  /** True if `value` (an item's identifying value) is currently pressed — abstracts over the `single`/`multiple` value-shape difference so `ToggleGroupItem` never needs to know which `type` the root is (same pattern `AccordionContextValue.isItemOpen` uses). */
  isItemPressed: (value: string) => boolean;
  /** Press/unpress `value`. For `type="single"` this also unpresses whichever other item was pressed; for `type="multiple"` it only touches this one item. */
  onItemPressedChange: (value: string, pressed: boolean) => void;
  disabled: boolean;
  orientation: RovingFocusGroupOrientation;
}

const TOGGLE_GROUP_NAME = 'ToggleGroup';

/**
 * Scoped context factory for ToggleGroup — mirrors `Accordion`/`RadioGroup`'s
 * use of `createContextScope` so a nested `ToggleGroup` mints its own context
 * instead of colliding with an outer one.
 */
const [createToggleGroupContext, createToggleGroupScope] = createContextScope(TOGGLE_GROUP_NAME);
const [ToggleGroupProvider, useToggleGroupContext] =
  createToggleGroupContext<ToggleGroupContextValue>(TOGGLE_GROUP_NAME);

/** Every consumer prop object accepts an optional internal `__scopeToggleGroup` prop threaded through by `createToggleGroupScope` — not part of the public API. */
type ScopedProps<P> = P & { __scopeToggleGroup?: Scope<ToggleGroupContextValue> };

export { TOGGLE_GROUP_NAME, ToggleGroupProvider, useToggleGroupContext, createToggleGroupScope };
export type { ToggleGroupContextValue, ScopedProps };
