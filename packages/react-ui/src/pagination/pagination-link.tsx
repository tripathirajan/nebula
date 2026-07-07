import { PaginationLink as HeadlessPaginationLink } from '@nebula/headless/pagination';
import { cn } from '@nebula/primitives/cn';
import * as React from 'react';

import type { PaginationLinkProps as HeadlessPaginationLinkProps } from '@nebula/headless/pagination';

type PaginationLinkProps = HeadlessPaginationLinkProps;

/**
 * One page number — filled with `--pagination-link-active-bg`/`-active-text`
 * on `data-state="active"` (set by the underlying `@nebula/headless` link),
 * a subtle hover background otherwise (see `../tokens/component.ts`).
 *
 * @example
 * ```tsx
 * <PaginationLink page={3}>3</PaginationLink>
 * ```
 */
const PaginationLink = React.forwardRef<HTMLButtonElement, PaginationLinkProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <HeadlessPaginationLink
        className={cn(
          'inline-flex h-9 min-w-9 items-center justify-center rounded-[var(--radius-selector)] px-2 text-sm text-[var(--pagination-link-text)] transition-colors hover:bg-[var(--pagination-link-hover-bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pagination-link-active-bg)] disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-[var(--pagination-link-active-bg)] data-[state=active]:text-[var(--pagination-link-active-text)] data-[state=active]:hover:bg-[var(--pagination-link-active-bg)]',
          className,
        )}
        {...rest}
        ref={forwardedRef}
      />
    );
  },
);

PaginationLink.displayName = 'PaginationLink';

export { PaginationLink };
export type { PaginationLinkProps };
