import { createContextScope } from '@nebula-lab/primitives/create-context-scope';

import type { Scope } from '@nebula-lab/primitives/create-context-scope';
import type { RefObject } from 'react';

interface CommandContextValue {
  inputValue: string;
  onInputValueChange: (value: string) => void;
  /** The option currently reachable via `aria-activedescendant` — real DOM
   * focus always stays on `CommandInput`, same technique `Combobox` uses,
   * since typing has to keep working while arrowing through results. */
  highlightedValue: string | undefined;
  setHighlightedValue: (value: string | undefined) => void;
  disabled: boolean;
  listId: string;
  inputId: string;
  /** Deterministic id for a given item's value, shared between `CommandInput`'s `aria-activedescendant` and `CommandItem`'s own `id`. */
  getOptionId: (value: string) => string;
  /** The mounted `CommandList` — read by `CommandInput`'s arrow-key handling
   * to query currently-rendered (i.e. not filtered out by the consumer)
   * `[role="option"]` elements directly, same "query the DOM instead of a
   * separate registered-order array" simplification `Listbox`'s typeahead
   * and `Combobox`'s highlight-navigation use. */
  listRef: RefObject<HTMLDivElement | null>;
  registerItemSelect: (value: string, onSelect: () => void) => void;
  unregisterItemSelect: (value: string) => void;
  selectItem: (value: string) => void;
}

const COMMAND_NAME = 'Command';

/**
 * Scoped context factory for the Command root — mirrors every other
 * compound component's use of `createContextScope`. Unlike `Combobox`,
 * there's no `Popper` scope to compose in: `CommandList` is always visible
 * right below `CommandInput`, never anchor-positioned or portalled — a
 * command palette's own container (typically a `Dialog` the consumer wraps
 * this in) already handles placement.
 */
const [createCommandContext, createCommandScope] = createContextScope(COMMAND_NAME);
const [CommandProvider, useCommandContext] =
  createCommandContext<CommandContextValue>(COMMAND_NAME);

/** Every consumer prop object accepts an optional internal `__scopeCommand` prop threaded through by `createCommandScope` — not part of the public API. */
type ScopedProps<P> = P & { __scopeCommand?: Scope<CommandContextValue> };

export { COMMAND_NAME, CommandProvider, useCommandContext, createCommandScope };
export type { CommandContextValue, ScopedProps };
