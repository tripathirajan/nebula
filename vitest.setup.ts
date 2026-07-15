// Loaded once before every test file (see vitest.config.ts's `setupFiles`).
//
// `@testing-library/jest-dom/vitest` adds DOM matchers (`toBeInTheDocument`,
// `toHaveAttribute`, ...) and auto-registers them on Vitest's `expect`.
import { cleanup } from '@testing-library/react';
import { expect, afterEach } from 'vitest';
import { toHaveNoViolations } from 'vitest-axe/matchers';

import '@testing-library/jest-dom/vitest';
// `vitest-axe/extend-expect`'s .d.ts is what declares `toHaveNoViolations` on
// Vitest's `Assertion`/`AsymmetricMatchersContaining` globally — kept for
// that typing. Its *runtime* file (as published in vitest-axe@0.1.0) is
// empty, though, so registering the matcher actually happens via the
// explicit `expect.extend` below, using the real implementation imported
// from `vitest-axe/matchers` instead.
import 'vitest-axe/extend-expect';

expect.extend({ toHaveNoViolations });

// JSDOM doesn't implement certain browser APIs that axe-core can query.
// These shims let axe run in tests without requiring a real browser.
if (typeof window !== 'undefined' && window?.document) {
  const originalGetComputedStyle = window.getComputedStyle.bind(window);

  window.getComputedStyle = (elt: Element, pseudoElt?: string | null) => {
    try {
      return originalGetComputedStyle(elt, pseudoElt);
    } catch {
      return originalGetComputedStyle(elt);
    }
  };

  if (typeof window.HTMLCanvasElement !== 'undefined') {
    window.HTMLCanvasElement.prototype.getContext = function () {
      return null;
    };
  }

  // JSDOM doesn't implement `window.matchMedia` at all — `@nebula/hooks`'
  // `useMediaQuery` (and anything built on it, e.g. `DataTableBlock`'s
  // responsive card/table switch) throws immediately without this. Defaults
  // to `matches: false` (the safe, non-surprising default — "no viewport
  // matches" rather than accidentally reporting every query as matching);
  // a test that specifically needs `matches: true` overrides
  // `window.matchMedia` locally, same as any other per-test browser-API mock
  // in this codebase (e.g. `DataGrid`/`VirtualList`'s local `ResizeObserver`
  // mocks) rather than this global default trying to guess it.
  if (typeof window.matchMedia !== 'function') {
    window.matchMedia = (query: string) =>
      ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }) as MediaQueryList;
  }
}

// `@testing-library/react` only self-registers its `afterEach(cleanup)` when
// it finds a global `afterEach` — with `test.globals: false` (vitest.config.ts)
// there isn't one, so nothing ever unmounted prior renders. Every `render()`
// across a test file was piling onto the same `document.body`, which is why
// queries like `getByRole` started matching N leftover copies from earlier
// tests instead of just the current one.
afterEach(cleanup);
