import { defineConfig } from 'tsup';

// One entry per module — see component-library-architecture.md §9.1.
export default defineConfig({
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
  sourcemap: true,
  splitting: false,
  clean: true,
  treeshake: true,
});
