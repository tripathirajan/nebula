import { cn } from '@nebula/primitives/cn';
import * as React from 'react';

import { Input } from '../input/input';

import type { InputProps } from '../input/input';

type SearchFieldProps = Omit<InputProps, 'type'>;

/**
 * An `Input` preset to `type="search"` with a built-in leading search icon —
 * like `PasswordField`, a `react-ui`-layer-only convenience (no
 * `@nebula/headless` counterpart), since a native `type="search"` input
 * already gives the platform's own clear-button/Escape-to-clear affordance
 * for free, with nothing left for this layer to add behaviorally.
 *
 * @example
 * ```tsx
 * <SearchField placeholder="Search…" />
 * ```
 */
const SearchField = React.forwardRef<HTMLInputElement, SearchFieldProps>((props, forwardedRef) => {
  const { className, ...rest } = props;
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
      <Input type="search" className={cn('pl-9', className)} {...rest} ref={forwardedRef} />
    </div>
  );
});

SearchField.displayName = 'SearchField';

export { SearchField };
export type { SearchFieldProps };
