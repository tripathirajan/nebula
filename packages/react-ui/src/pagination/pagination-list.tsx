import { cn } from '@nebula/primitives/cn';
import { PaginationList as StylelessPaginationList } from '@nebula/styleless/pagination';
import * as React from 'react';

import type { PaginationListProps as StylelessPaginationListProps } from '@nebula/styleless/pagination';

type PaginationListProps = StylelessPaginationListProps;

/** A simple flex row with gap between page items — `PaginationItem` itself has no chrome, `PaginationLink`/`Previous`/`Next` carry the visual treatment. */
const PaginationList = React.forwardRef<HTMLUListElement, PaginationListProps>(
  (props, forwardedRef) => {
    const { className, ...rest } = props;
    return (
      <StylelessPaginationList
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
