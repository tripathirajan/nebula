import { createContextScope } from '@nebula/primitives/create-context-scope';
import { createPopperScope } from '@nebula/primitives/popper';

import type { Scope } from '@nebula/primitives/create-context-scope';
import type { RefObject } from 'react';

interface ComboboxContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The currently *selected* item's value — distinct from `highlightedValue`, which is just the virtually-focused option while the user arrows through the list. */
  value: string | undefined;
  onValueChange: (value: string, label: string) => void;
  inputValue: string;
  onInputValueChange: (value: string) => void;
  /** The option currently reachable via `aria-activedescendant` — real DOM focus always stays on `ComboboxInput`, per the WAI-ARIA combobox pattern (unlike `Select`'s popup, which moves real focus in via `FocusScope`). */
  highlightedValue: string | undefined;
  setHighlightedValue: (value: string | undefined) => void;
  disabled: boolean;
  contentId: string;
  inputId: string;
  /** Deterministic id for a given item's value, shared between `ComboboxInput`'s `aria-activedescendant` and `ComboboxItem`'s own `id` — no registration round-trip needed just to know an option's id. */
  getOptionId: (value: string) => string;
  registerItemLabel: (value: string, label: string) => void;
  unregisterItemLabel: (value: string) => void;
  getItemLabel: (value: string) => string | undefined;
  /** The mounted `ComboboxContent` root — read by `ComboboxInput`'s arrow-key handling to query currently-rendered (i.e. not filtered out by the consumer) `[role="option"]` elements directly, same "query the DOM instead of tracking a separate registered-order array" simplification `Listbox`'s typeahead uses. */
  contentRef: RefObject<HTMLDivElement | null>;
}

const COMBOBOX_NAME = 'Combobox';

/**
 * Composes its own scope with `@nebula/primitives`' `Popper` scope, same
 * technique `Select`'s context uses.
 */
const [createComboboxContext, createComboboxScope] = createContextScope(COMBOBOX_NAME, [
  createPopperScope,
]);
const usePopperScope = createPopperScope();
const [ComboboxProvider, useComboboxContext] =
  createComboboxContext<ComboboxContextValue>(COMBOBOX_NAME);

/** Every consumer prop object accepts an optional internal `__scopeCombobox` prop threaded through by `createComboboxScope` — not part of the public API. */
type ScopedProps<P> = P & { __scopeCombobox?: Scope<ComboboxContextValue> };

export { COMBOBOX_NAME, ComboboxProvider, useComboboxContext, createComboboxScope, usePopperScope };
export type { ComboboxContextValue, ScopedProps };
