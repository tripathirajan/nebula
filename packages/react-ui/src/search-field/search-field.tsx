import { cn } from '@nebula-lab/primitives/cn';
import { SearchInput as StylelessSearchInput } from '@nebula-lab/styleless/search-input';
import * as React from 'react';

import { inputVariants } from '../input/input';

import type { SearchInputProps as StylelessSearchInputProps } from '@nebula-lab/styleless/search-input';
import type { VariantProps } from 'class-variance-authority';

type SearchFieldProps = StylelessSearchInputProps & VariantProps<typeof inputVariants>;

/**
 * Wraps `@nebula-lab/styleless`'s `SearchInput` (the `type="search"` preset)
 * and adds a leading search icon — like `PasswordField`, a `react-ui`-
 * layer-only visual addition (no `@nebula-lab/headless` counterpart), since a
 * native `type="search"` input already gives the platform's own clear-
 * button/Escape-to-clear affordance for free, with nothing left for a
 * lower layer to add behaviorally.
 *
 * @example
 * ```tsx
 * <SearchField placeholder="Search…" />
 * ```
 */
const SearchField = React.forwardRef<HTMLInputElement, SearchFieldProps>((props, forwardedRef) => {
  const { className, variant, ...rest } = props;
  return (
    <div className="relative">
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--input-text)]/50"
      >
        <circle cx={11} cy={11} r={8} />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <StylelessSearchInput
        className={cn(inputVariants({ variant }), 'pl-9', className)}
        {...rest}
        ref={forwardedRef}
      />
    </div>
  );
});

SearchField.displayName = 'SearchField';

export { SearchField };
export type { SearchFieldProps };
