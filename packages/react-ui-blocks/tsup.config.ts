import { defineConfig } from 'tsup';

export default defineConfig((options) => ({
  entry: {
    index: 'src/index.ts',
    'authentication/index': 'src/authentication/index.ts',
    'marketing/index': 'src/marketing/index.ts',
    'ecommerce/index': 'src/ecommerce/index.ts',
    'dashboard/index': 'src/dashboard/index.ts',
    'communication/index': 'src/communication/index.ts',
    'social/index': 'src/social/index.ts',
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
  external: ['react', 'react-dom', '@nebula-lab/primitives', '@nebula-lab/react-ui', 'recharts'],
}));
