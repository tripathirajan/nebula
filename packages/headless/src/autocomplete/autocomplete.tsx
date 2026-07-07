export { Combobox as Autocomplete } from '../combobox/combobox';
export type { ComboboxProps as AutocompleteProps } from '../combobox/combobox';

/**
 * Thin renamed re-export of {@link Combobox} — `Combobox` was already built
 * around free-text entry that doesn't require matching any option (typing
 * `inputValue` and the eventually-`onValueChange`d selection are two
 * separate, decoupled pieces of state), which is exactly what
 * "Autocomplete" means in most component-library taxonomies. Same
 * "reuse instead of reimplementing" call `DropdownMenu`/`Menu` made.
 */
