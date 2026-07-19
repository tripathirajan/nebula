import * as React from 'react';

import { Input } from '../input/input';

import type { InputProps } from '../input/input';

/** Props accepted by {@link SearchInput}. */
type SearchInputProps = Omit<InputProps, 'type'>;

/**
 * `styleless`-tier `SearchInput` — an `Input` preset to `type="search"`.
 * No icon here (that's a visual choice `@nebula-lab/react-ui`'s `SearchField`
 * makes) — a native `type="search"` input already gives the platform's own
 * clear-button/Escape-to-clear affordance for free, so there's nothing left
 * for this layer to add behaviorally beyond the type preset itself.
 *
 * @example
 * ```tsx
 * <SearchInput placeholder="Search…" />
 * ```
 */
const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>((props, forwardedRef) => {
  return <Input type="search" {...props} ref={forwardedRef} />;
});

SearchInput.displayName = 'SearchInput';

export { SearchInput };
export type { SearchInputProps };
