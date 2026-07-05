// Loaded once before every test file (see vitest.config.ts's `setupFiles`).
//
// `@testing-library/jest-dom/vitest` adds DOM matchers (`toBeInTheDocument`,
// `toHaveAttribute`, ...) and auto-registers them on Vitest's `expect`.
// `vitest-axe/extend-expect` does the same for `toHaveNoViolations`, backed
// by `axe-core` — this is what makes `expect(await axe(container)).toHaveNoViolations()`
// work in every `*.test.tsx` file without each one re-importing/extending.
import '@testing-library/jest-dom/vitest';
import 'vitest-axe/extend-expect';
