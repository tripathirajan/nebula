// Ambient augmentation making `vitest-axe`'s `toHaveNoViolations()` matcher
// visible to `tsc` under Vitest 2.x. Checked in per-package because each
// package's `tsc` run only sees its own `src` (`"include": ["src"]`).
// Present in every package that has a `*.test.tsx` calling
// `toHaveNoViolations()`.
import type { AxeMatchers } from 'vitest-axe/matchers';

declare global {
  namespace jest {
    interface Matchers<R = void, T = object> extends AxeMatchers {}
  }
}

export {};
