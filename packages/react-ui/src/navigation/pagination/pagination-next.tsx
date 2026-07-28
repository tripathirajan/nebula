import { PaginationNext as HeadlessPaginationNext } from '@nebula-lab/headless/pagination';
import { cn } from '@nebula-lab/primitives/cn';
import * as React from 'react';

import type { PaginationNextProps as HeadlessPaginationNextProps } from '@nebula-lab/headless/pagination';

type PaginationNextProps = HeadlessPaginationNextProps;

/** Same visual treatment as `PaginationPrevious`. */
const PaginationNext = React.forwardRef<HTMLButtonElement, PaginationNextProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <HeadlessPaginationNext
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

PaginationNext.displayName = 'PaginationNext';

export { PaginationNext };
export type { PaginationNextProps };
