import { PaginationPrevious as HeadlessPaginationPrevious } from '@nebula/headless/pagination';
import { cn } from '@nebula/primitives/cn';
import * as React from 'react';

import type { PaginationPreviousProps as HeadlessPaginationPreviousProps } from '@nebula/headless/pagination';

type PaginationPreviousProps = HeadlessPaginationPreviousProps;

/** Same visual treatment as `PaginationLink`, minus the active-page fill (it's never itself "the current page"). */
const PaginationPrevious = React.forwardRef<HTMLButtonElement, PaginationPreviousProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <HeadlessPaginationPrevious
        className={cn(
          'inline-flex h-9 items-center gap-1 rounded-[var(--radius-selector)] px-3 text-sm text-[var(--pagination-link-text)] transition-colors hover:bg-[var(--pagination-link-hover-bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pagination-link-active-bg)] disabled:pointer-events-none disabled:opacity-50',
          className,
        )}
        {...rest}
        ref={forwardedRef}
      />
    );
  },
);

PaginationPrevious.displayName = 'PaginationPrevious';

export { PaginationPrevious };
export type { PaginationPreviousProps };
