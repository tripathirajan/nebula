import { defineConfig } from 'tsup';

// One entry per module — see component-library-architecture.md §9.1.
export default defineConfig((options) => ({
  entry: {
    index: 'src/index.ts',
    'clamp/index': 'src/clamp/index.ts',
    'debounce/index': 'src/debounce/index.ts',
    'throttle/index': 'src/throttle/index.ts',
    'deep-merge/index': 'src/deep-merge/index.ts',
    'is-html-element/index': 'src/is-html-element/index.ts',
    'is-focusable/index': 'src/is-focusable/index.ts',
  },
  format: ['esm'],
  target: 'es2022',
  // See packages/primitives/tsup.config.ts for why dts is generated via a
  // separate `tsc --emitDeclarationOnly` pass instead of tsup's `dts: true`
  // (ERR_WORKER_OUT_OF_MEMORY — https://github.com/egoist/tsup/issues/920).
  dts: false,
  sourcemap: !!options.watch, // maps are dev/debug DX weight only, not needed by consumers; skip them for the real publish build, keep them under `tsup --watch` (this package's `dev` script) for local debugging
  splitting: false,
  clean: true,
  treeshake: true,
}));
