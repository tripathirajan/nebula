const ELLIPSIS = 'ellipsis' as const;

type PaginationRangeItem = number | typeof ELLIPSIS;

function range(start: number, end: number): number[] {
  return Array.from({ length: Math.max(0, end - start + 1) }, (_, i) => start + i);
}

/**
 * Computes which page numbers (plus `'ellipsis'` markers) to render for a
 * given current `page`/`pageCount`, so consumers don't have to hand-roll the
 * usual "show first/last `boundaryCount` pages, `siblingCount` pages either
 * side of the current one, collapse the rest into an ellipsis" truncation
 * math themselves — exported standalone (not only used internally by
 * `Pagination`) since it's pure and has no DOM/rendering opinion at all.
 *
 * @example
 * ```tsx
 * usePaginationRange({ page: 5, pageCount: 10 })
 * // -> [1, 'ellipsis', 4, 5, 6, 'ellipsis', 10]
 * ```
 */
function usePaginationRange(options: {
  page: number;
  pageCount: number;
  /** Pages shown on each side of the current page. @default 1 */
  siblingCount?: number;
  /** Pages always shown at the very start/end. @default 1 */
  boundaryCount?: number;
}): PaginationRangeItem[] {
  const { page, pageCount, siblingCount = 1, boundaryCount = 1 } = options;

  if (pageCount <= 0) return [];

  // Total slots needed to show every page with no truncation at all: the
  // two boundary regions, the current page, its siblings on each side, and
  // (rounding up) the two ellipsis slots they'd otherwise occupy.
  const totalPageNumbers = boundaryCount * 2 + siblingCount * 2 + 3;
  if (pageCount <= totalPageNumbers) return range(1, pageCount);

  const leftSiblingIndex = Math.max(page - siblingCount, boundaryCount + 1);
  const rightSiblingIndex = Math.min(page + siblingCount, pageCount - boundaryCount);

  const showLeftEllipsis = leftSiblingIndex > boundaryCount + 2;
  const showRightEllipsis = rightSiblingIndex < pageCount - boundaryCount - 1;

  const items: PaginationRangeItem[] = [
    ...range(1, boundaryCount),
    ...(showLeftEllipsis ? [ELLIPSIS] : range(boundaryCount + 1, leftSiblingIndex - 1)),
    ...range(leftSiblingIndex, rightSiblingIndex),
    ...(showRightEllipsis ? [ELLIPSIS] : range(rightSiblingIndex + 1, pageCount - boundaryCount)),
    ...range(pageCount - boundaryCount + 1, pageCount),
  ];

  // De-duplicate defensively (page numbers only — an 'ellipsis' marker is
  // never a duplicate of a real page) while preserving order, in case an
  // unusual `siblingCount`/`boundaryCount` combination causes two of the
  // ranges above to overlap.
  const seenPages = new Set<number>();
  return items.filter((item) => {
    if (item === ELLIPSIS) return true;
    if (seenPages.has(item)) return false;
    seenPages.add(item);
    return true;
  });
}

export { usePaginationRange, ELLIPSIS };
export type { PaginationRangeItem };
