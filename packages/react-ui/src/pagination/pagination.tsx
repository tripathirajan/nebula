// The root renders a plain `<nav>` with no visual chrome of its own (see
// `@nebula/styleless`'s `Pagination`) — layout/styling lives on
// `PaginationList`/`PaginationLink`/etc., so there's nothing for this layer
// to add here.
export { Pagination } from '@nebula/styleless/pagination';
export type { PaginationProps } from '@nebula/styleless/pagination';
export { usePaginationRange, ELLIPSIS } from '@nebula/styleless/pagination';
export type { PaginationRangeItem } from '@nebula/styleless/pagination';
