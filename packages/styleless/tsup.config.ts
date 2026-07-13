import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'button/index': 'src/button/index.ts',
    'icon-button/index': 'src/icon-button/index.ts',
    'fab/index': 'src/fab/index.ts',
    'split-button/index': 'src/split-button/index.ts',
    'input/index': 'src/input/index.ts',
    'textarea/index': 'src/textarea/index.ts',
    'password-input/index': 'src/password-input/index.ts',
    'search-input/index': 'src/search-input/index.ts',
    'email-input/index': 'src/email-input/index.ts',
    'url-input/index': 'src/url-input/index.ts',
    'tel-input/index': 'src/tel-input/index.ts',
    'image-preview/index': 'src/image-preview/index.ts',
    'avatar/index': 'src/avatar/index.ts',
    'avatar-group/index': 'src/avatar-group/index.ts',
    'code-block/index': 'src/code-block/index.ts',
    'data-table/index': 'src/data-table/index.ts',
    'data-grid/index': 'src/data-grid/index.ts',
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
  external: ['react', 'react-dom', '@nebula/hooks', '@nebula/primitives', '@nebula/headless'],
});
