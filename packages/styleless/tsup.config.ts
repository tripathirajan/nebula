import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'toggle/index': 'src/toggle/index.ts',
    'toggle-group/index': 'src/toggle-group/index.ts',
    'breadcrumb/index': 'src/breadcrumb/index.ts',
    'tabs/index': 'src/tabs/index.ts',
    'checkbox/index': 'src/checkbox/index.ts',
    'switch/index': 'src/switch/index.ts',
    'radio-group/index': 'src/radio-group/index.ts',
    'collapsible/index': 'src/collapsible/index.ts',
    'accordion/index': 'src/accordion/index.ts',
    'dialog/index': 'src/dialog/index.ts',
    'alert-dialog/index': 'src/alert-dialog/index.ts',
    'popover/index': 'src/popover/index.ts',
    'tooltip/index': 'src/tooltip/index.ts',
    'menu/index': 'src/menu/index.ts',
    'dropdown-menu/index': 'src/dropdown-menu/index.ts',
    'context-menu/index': 'src/context-menu/index.ts',
    'menubar/index': 'src/menubar/index.ts',
    'progress/index': 'src/progress/index.ts',
    'spinner/index': 'src/spinner/index.ts',
    'skeleton/index': 'src/skeleton/index.ts',
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
  external: ['react', 'react-dom', '@nebula/hooks', '@nebula/primitives'],
});
