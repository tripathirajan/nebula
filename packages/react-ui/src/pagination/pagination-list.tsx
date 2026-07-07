import { PaginationList as HeadlessPaginationList } from '@nebula/headless/pagination';
import { cn } from '@nebula/primitives/cn';
import * as React from 'react';

import type { PaginationListProps as HeadlessPaginationListProps } from '@nebula/headless/pagination';

type PaginationListProps = HeadlessPaginationListProps;

/** A simple flex row with gap between page items — `PaginationItem` itself has no chrome, `PaginationLink`/`Previous`/`Next` carry the visual treatment. */
const PaginationList = React.forwardRef<HTMLUListElement, PaginationListProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <HeadlessPaginationList
        className={cn('flex items-center gap-1', className)}
        {...rest}
        ref={forwardedRef}
      />
    );
  },
);

PaginationList.displayName = 'PaginationList';

export { PaginationList };
export type { PaginationListProps };
