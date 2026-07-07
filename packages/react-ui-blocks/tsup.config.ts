import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'theme-switcher/index': 'src/theme-switcher/index.ts',
    'app-layout/index': 'src/app-layout/index.ts',
    'login-form/index': 'src/login-form/index.ts',
    'transaction-form/index': 'src/transaction-form/index.ts',
    'dashboard-layout/index': 'src/dashboard-layout/index.ts',
    'auth-layout/index': 'src/auth-layout/index.ts',
    'settings-layout/index': 'src/settings-layout/index.ts',
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
  external: ['react', 'react-dom', '@nebula/primitives', '@nebula/react-ui'],
});
