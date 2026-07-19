import { createContextScope } from '@nebula-lab/primitives/create-context-scope';

import type { Scope } from '@nebula-lab/primitives/create-context-scope';
import type { RovingFocusGroupOrientation } from '@nebula-lab/primitives/roving-focus-group';

interface ListboxContextValue {
  /** True if `value` (an option's identifying value) is currently selected — abstracts over the `single`/`multiple` value-shape difference, same technique `AccordionContextValue.isItemOpen`/`ToggleGroupContextValue.isItemPressed` use. */
  isItemSelected: (value: string) => boolean;
  /** Select/deselect `value`. For `type="single"` this also deselects whichever other option was selected; for `type="multiple"` it only touches this one option. */
  onItemSelectedChange: (value: string, selected: boolean) => void;
  /** `type="single"`: arrow-key focus movement also selects the newly-focused option (matches a native `<select>`/`RadioGroup`). `type="multiple"`: focus movement never selects — only click/Enter/Space toggles (matches `ToggleGroup`). */
  selectOnFocus: boolean;
  /**
   * Returns `true` exactly once per `Listbox` mount (`false` on every call
   * after) — lets `selectOnFocus` tell apart a real arrow-key/Tab focus
   * move from the single programmatic focus `FocusScope` fires when a
   * `Listbox` mounts inside a freshly-opened popover (`Select`, `Combobox`'s
   * listbox reuse). Without this, that accessibility auto-focus — which
   * only exists so keyboard users land inside the popup, not a deliberate
   * navigation — reads as the user selecting the first option, instantly
   * re-closing whatever popup just opened.
   */
  consumeInitialFocusSuppression: () => boolean;
  disabled: boolean;
  orientation: RovingFocusGroupOrientation;
}

const LISTBOX_NAME = 'Listbox';

/**
 * Scoped context factory for Listbox — mirrors `Accordion`/`ToggleGroup`'s
 * use of `createContextScope` so a nested `Listbox` (e.g. inside a
 * `Combobox`'s popover) mints its own context instead of colliding.
 */
const [createListboxContext, createListboxScope] = createContextScope(LISTBOX_NAME);
const [ListboxProvider, useListboxContext] =
  createListboxContext<ListboxContextValue>(LISTBOX_NAME);

/** Every consumer prop object accepts an optional internal `__scopeListbox` prop threaded through by `createListboxScope` — not part of the public API. */
type ScopedProps<P> = P & { __scopeListbox?: Scope<ListboxContextValue> };

export { LISTBOX_NAME, ListboxProvider, useListboxContext, createListboxScope };
export type { ListboxContextValue, ScopedProps };
