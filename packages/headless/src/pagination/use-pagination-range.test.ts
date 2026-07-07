import { describe, expect, it } from 'vitest';

import { usePaginationRange } from './use-pagination-range';

describe('usePaginationRange', () => {
  it('returns every page with no ellipsis when pageCount is small', () => {
    expect(usePaginationRange({ page: 3, pageCount: 5 })).toEqual([1, 2, 3, 4, 5]);
  });

  it('collapses both sides for a page in the middle', () => {
    expect(usePaginationRange({ page: 5, pageCount: 10 })).toEqual([
      1,
      'ellipsis',
      4,
      5,
      6,
      'ellipsis',
      10,
    ]);
  });

  it('only collapses the right side when near the start', () => {
    expect(usePaginationRange({ page: 1, pageCount: 10 })).toEqual([1, 2, 'ellipsis', 10]);
  });

  it('only collapses the left side when near the end', () => {
    expect(usePaginationRange({ page: 10, pageCount: 10 })).toEqual([1, 'ellipsis', 9, 10]);
  });

  it('respects a larger siblingCount', () => {
    expect(usePaginationRange({ page: 10, pageCount: 20, siblingCount: 2 })).toEqual([
      1,
      'ellipsis',
      8,
      9,
      10,
      11,
      12,
      'ellipsis',
      20,
    ]);
  });

  it('respects a larger boundaryCount', () => {
    expect(usePaginationRange({ page: 10, pageCount: 20, boundaryCount: 2 })).toEqual([
      1,
      2,
      'ellipsis',
      9,
      10,
      11,
      'ellipsis',
      19,
      20,
    ]);
  });

  it('every page number in the result is between 1 and pageCount, no duplicates', () => {
    // `usePaginationRange` is a plain pure function (no hooks inside it) that
    // happens to be named with a `use` prefix for API-naming consistency with
    // the rest of the library, not because it's a real React hook — safe to
    // call in a loop here, so silence the rules-of-hooks false positive.
    for (let page = 1; page <= 20; page++) {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const result = usePaginationRange({ page, pageCount: 20 });
      const pages = result.filter((item): item is number => item !== 'ellipsis');
      expect(new Set(pages).size).toBe(pages.length);
      for (const p of pages) {
        expect(p).toBeGreaterThanOrEqual(1);
        expect(p).toBeLessThanOrEqual(20);
      }
      // Always includes the current page itself.
      expect(pages).toContain(page);
    }
  });

  it('returns an empty array for pageCount <= 0', () => {
    expect(usePaginationRange({ page: 1, pageCount: 0 })).toEqual([]);
  });
});
