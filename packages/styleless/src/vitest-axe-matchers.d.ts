// Ambient augmentation making `vitest-axe`'s `toHaveNoViolations()` matcher
// visible to `tsc` under Vitest 2.x. Checked in per-package (rather than
// once at the repo root) because each package's `tsc` run only sees its own
// `src` (`"include": ["src"]"`) — a root-level file wouldn't be picked up.
// Present in every package that has a `*.test.tsx` calling
// `toHaveNoViolations()` (currently `primitives`, `styleless`, `react-ui`).
//
// `vitest-axe@0.1.0`'s own `extend-expect.d.ts` augments `declare global {
// namespace Vi { interface Assertion<T> {} } }` — a pre-Vitest-2 convention.
// Vitest 2.x's `expect()` return type comes from `@vitest/expect`'s
// exported `Assertion<T>` interface, which has nothing to do with a global
// `Vi` namespace any more, so that augmentation is inert under `tsc` (the
// matcher still works at runtime — `vitest.setup.ts`'s side-effect import
// registers it on the real `expect`; this is a types-only gap).
//
// The fix mirrors how `@testing-library/jest-dom`'s *own* types already
// reach Vitest's `Assertion` in this codebase (see
// `@testing-library/jest-dom/types/jest.d.ts`): `@vitest/expect` declares
// `declare global { namespace jest { interface Matchers<R, T> {} } }`, and
// `Assertion<T> extends JestAssertion<T> extends jest.Matchers<void, T>` —
// so augmenting that same global `jest.Matchers` interface flows straight
// into Vitest's `Assertion` without touching the `vitest`/`@vitest/expect`
// modules directly.
//
// (An earlier attempt used `declare module 'vitest' { interface Assertion
// ... }` directly, but without a preceding `import 'vitest'` side-effect
// import that turns this into an *augmentation* of the real module, `tsc`
// treats a bare `declare module 'vitest' { ... }` as a brand new ambient
// module declaration that fully shadows the real one — hiding
// `describe`/`expect`/`it` entirely. The `jest.Matchers` route sidesteps
// that failure mode altogether since global-namespace merging doesn't
// require any such import.)
import type { AxeMatchers } from 'vitest-axe/matchers';

declare global {
  namespace jest {
    interface Matchers<R = void, T = object> extends AxeMatchers {}
  }
}

export {};
