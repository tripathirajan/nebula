import { useControllableState } from '@nebula/hooks';
import { Primitive } from '@nebula/primitives/primitive';
import * as React from 'react';

import { PaginationProvider } from './pagination-context';

import type { ScopedProps } from './pagination-context';
import type { PrimitivePropsWithRef } from '@nebula/primitives/primitive';

interface PaginationProps extends PrimitivePropsWithRef<'nav'> {
  page?: number;
  defaultPage?: number;
  onPageChange?: (page: number) => void;
  /** Total number of pages, 1-indexed. */
  pageCount: number;
  disabled?: boolean;
}

/**
 * Root of the Pagination compound component — a `<nav>` (per the WAI-ARIA
 * Authoring Practices' guidance that pagination is just a labeled
 * navigation landmark over a list of links, not a distinct ARIA pattern of
 * its own) wrapping {@link PaginationList}/{@link PaginationItem}/
 * {@link PaginationLink}, plus {@link PaginationPrevious}/
 * {@link PaginationNext} convenience controls. Defaults `aria-label` to
 * `"pagination"` (override it, e.g. `"Search results pages"`, when there's
 * more than one paginated region on a page).
 *
 * @example
 * ```tsx
 * <Pagination page={page} onPageChange={setPage} pageCount={10}>
 *   <PaginationList>
 *     <PaginationItem><PaginationPrevious /></PaginationItem>
 *     {usePaginationRange({ page, pageCount: 10 }).map((item, i) =>
 *       item === 'ellipsis' ? (
 *         <PaginationItem key={`ellipsis-${i}`}><PaginationEllipsis /></PaginationItem>
 *       ) : (
 *         <PaginationItem key={item}><PaginationLink page={item}>{item}</PaginationLink></PaginationItem>
 *       ),
 *     )}
 *     <PaginationItem><PaginationNext /></PaginationItem>
 *   </PaginationList>
 * </Pagination>
 * ```
 */
const Pagination = React.forwardRef<HTMLElement, ScopedProps<PaginationProps>>(
  (props, forwardedRef) => {
    const {
      __scopePagination,
      page: pageProp,
      defaultPage = 1,
      onPageChange,
      pageCount,
      disabled = false,
      'aria-label': ariaLabel,
      ...navProps
    } = props;

    const [page, setPage] = useControllableState<number>({
      prop: pageProp,
      defaultProp: defaultPage,
      onChange: onPageChange,
    });

    return (
      <PaginationProvider
        scope={__scopePagination}
        page={page ?? defaultPage}
        onPageChange={setPage}
        pageCount={pageCount}
        disabled={disabled}
      >
        <Primitive
          as="nav"
          aria-label={ariaLabel ?? 'pagination'}
          {...navProps}
          ref={forwardedRef}
        />
      </PaginationProvider>
    );
  },
);

Pagination.displayName = 'Pagination';

export { Pagination };
export type { PaginationProps };
