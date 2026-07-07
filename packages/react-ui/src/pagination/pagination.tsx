// The root renders a plain `<nav>` with no visual chrome of its own (see
// `@nebula/headless`'s `Pagination`) — layout/styling lives on
// `PaginationList`/`PaginationLink`/etc., so there's nothing for this layer
// to add here.
export { Pagination } from '@nebula/headless/pagination';
export type { PaginationProps } from '@nebula/headless/pagination';
export { usePaginationRange, ELLIPSIS } from '@nebula/headless/pagination';
export type { PaginationRangeItem } from '@nebula/headless/pagination';
