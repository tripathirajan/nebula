import { PaginationEllipsis as HeadlessPaginationEllipsis } from '@nebula-lab/headless/pagination';
import { cn } from '@nebula-lab/primitives/cn';
import * as React from 'react';

import type { PaginationEllipsisProps as HeadlessPaginationEllipsisProps } from '@nebula-lab/headless/pagination';

type PaginationEllipsisProps = HeadlessPaginationEllipsisProps;

/** Muted, non-interactive "…" marker between the same `h-9 min-w-9` box `PaginationLink` uses, so collapsed runs line up visually with real page links. */
const PaginationEllipsis = React.forwardRef<HTMLSpanElement, PaginationEllipsisProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <HeadlessPaginationEllipsis
        className={cn(
          'inline-flex h-9 min-w-9 items-center justify-center text-sm text-[var(--pagination-link-text)]/50',
          className,
        )}
        {...rest}
        ref={forwardedRef}
      />
    );
  },
);

PaginationEllipsis.displayName = 'PaginationEllipsis';

export { PaginationEllipsis };
export type { PaginationEllipsisProps };
