# @nebula-lab/utilities

Framework-agnostic helpers — no React dependency, nothing in the workspace depends below this. Everything else (`hooks`, `primitives`, ...) may depend on this package.

## Installation

```bash
npm install @nebula-lab/utilities
# or
yarn add @nebula-lab/utilities
# or
pnpm add @nebula-lab/utilities
# or
bun add @nebula-lab/utilities
```

No peer dependencies — works in any JS/TS environment, browser or Node. npm is shown first since it ships with Node.js and remains the most widely used option, but yarn, pnpm, and bun all work identically.

**Module format:** ESM only (no CommonJS build). Works out of the box with any bundler (Vite, Webpack, esbuild, Rollup, Parcel) or native Node.js ESM. A plain CommonJS `require('@nebula-lab/utilities')` is **not** supported and throws `ERR_REQUIRE_ESM` — use `import` (or dynamic `import()` from a CJS file) instead.

**TypeScript / JavaScript:** Ships hand-written `.d.ts` types alongside the JS output, but nothing requires TypeScript — plain JavaScript works identically. TypeScript users get full autocomplete/type-checking for free; JavaScript users just don't see the type annotations.

## What's here

- `clamp(value, min, max)`
- `debounce(fn, wait)` / `throttle(fn, wait, { trailing? })` — cancelable, `debounce` also exposes `.flush()`
- `deepMerge(target, ...sources)` — recursive merge for plain objects (used for theme token layer composition)
- `isHTMLElement(value)` / `isFocusable(element)` — SSR-safe DOM type guards

## Import

```ts
import { clamp, debounce } from '@nebula-lab/utilities';
// or per-module subpath
import { clamp } from '@nebula-lab/utilities/clamp';
```

## Contributing

See the [monorepo's CONTRIBUTING.md](../../CONTRIBUTING.md).

## License

MIT
