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

// `@testing-library/react` only self-registers its `afterEach(cleanup)` when
// it finds a global `afterEach` — with `test.globals: false` (vitest.config.ts)
// there isn't one, so nothing ever unmounted prior renders. Every `render()`
// across a test file was piling onto the same `document.body`, which is why
// queries like `getByRole` started matching N leftover copies from earlier
// tests instead of just the current one.
afterEach(cleanup);
