import { defineConfig } from 'tsup';

// One entry per hook — see component-library-architecture.md §9.1.
export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'use-controllable-state/index': 'src/use-controllable-state/index.ts',
    'use-click-outside/index': 'src/use-click-outside/index.ts',
    'use-media-query/index': 'src/use-media-query/index.ts',
    'use-scroll-lock/index': 'src/use-scroll-lock/index.ts',
    'use-focus-trap/index': 'src/use-focus-trap/index.ts',
    'use-resize-observer/index': 'src/use-resize-observer/index.ts',
    'use-intersection-observer/index': 'src/use-intersection-observer/index.ts',
    'use-mutation-observer/index': 'src/use-mutation-observer/index.ts',
    'use-local-storage/index': 'src/use-local-storage/index.ts',
    'use-debounce/index': 'src/use-debounce/index.ts',
    'use-id/index': 'src/use-id/index.ts',
    'use-boolean/index': 'src/use-boolean/index.ts',
    'use-toggle/index': 'src/use-toggle/index.ts',
    'use-stable-callback/index': 'src/use-stable-callback/index.ts',
    'use-event-listener/index': 'src/use-event-listener/index.ts',
    'use-previous/index': 'src/use-previous/index.ts',
    'use-mounted/index': 'src/use-mounted/index.ts',
    'use-virtualizer/index': 'src/use-virtualizer/index.ts',
    'use-swipe/index': 'src/use-swipe/index.ts',
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
  external: ['react'],
});
