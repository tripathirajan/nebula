import { cn } from '@nebula/primitives/cn';
import { PaginationPrevious as StylelessPaginationPrevious } from '@nebula/styleless/pagination';
import * as React from 'react';

import type { PaginationPreviousProps as StylelessPaginationPreviousProps } from '@nebula/styleless/pagination';

type PaginationPreviousProps = StylelessPaginationPreviousProps;

/** Same visual treatment as `PaginationLink`, minus the active-page fill (it's never itself "the current page"). */
const PaginationPrevious = React.forwardRef<HTMLButtonElement, PaginationPreviousProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <StylelessPaginationPrevious
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
