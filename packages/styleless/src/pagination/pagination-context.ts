import { createContextScope } from '@nebula/primitives/create-context-scope';

import type { Scope } from '@nebula/primitives/create-context-scope';

interface PaginationContextValue {
  page: number;
  onPageChange: (page: number) => void;
  pageCount: number;
  disabled: boolean;
}

const PAGINATION_NAME = 'Pagination';

/**
 * Scoped context factory for Pagination — mirrors every other compound
 * component's use of `createContextScope`.
 */
const [createPaginationContext, createPaginationScope] = createContextScope(PAGINATION_NAME);
const [PaginationProvider, usePaginationContext] =
  createPaginationContext<PaginationContextValue>(PAGINATION_NAME);

/** Every consumer prop object accepts an optional internal `__scopePagination` prop threaded through by `createPaginationScope` — not part of the public API. */
type ScopedProps<P> = P & { __scopePagination?: Scope<PaginationContextValue> };

export { PAGINATION_NAME, PaginationProvider, usePaginationContext, createPaginationScope };
export type { PaginationContextValue, ScopedProps };
