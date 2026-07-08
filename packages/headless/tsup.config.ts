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
    'field/index': 'src/field/index.ts',
    'listbox/index': 'src/listbox/index.ts',
    'select/index': 'src/select/index.ts',
    'checkbox-group/index': 'src/checkbox-group/index.ts',
    'number-input/index': 'src/number-input/index.ts',
    'combobox/index': 'src/combobox/index.ts',
    'autocomplete/index': 'src/autocomplete/index.ts',
    'slider/index': 'src/slider/index.ts',
    'rating/index': 'src/rating/index.ts',
    'otp-input/index': 'src/otp-input/index.ts',
    'color-picker/index': 'src/color-picker/index.ts',
    'file-upload/index': 'src/file-upload/index.ts',
    'pagination/index': 'src/pagination/index.ts',
    'stepper/index': 'src/stepper/index.ts',
    'tree/index': 'src/tree/index.ts',
    'navigation-menu/index': 'src/navigation-menu/index.ts',
    'drawer/index': 'src/drawer/index.ts',
    'hover-card/index': 'src/hover-card/index.ts',
    'toast/index': 'src/toast/index.ts',
    'tree-view/index': 'src/tree-view/index.ts',
    'command/index': 'src/command/index.ts',
  },
  format: ['esm'],
  target: 'es2022',
  // See packages/primitives/tsup.config.ts for why dts is generated via a
  // separate `tsc --emitDeclarationOnly` pass instead of tsup's `dts: true`
  // (ERR_WORKER_OUT_OF_MEMORY — https://github.com/egoist/tsup/issues/920).
  dts: false,
  sourcemap: true,
  // Unlike every other package here, `headless` has several components that
  // reuse another component's scoped context across a *relative* (not
  // package-specifier) import — `AlertDialogContent` reads `Dialog`'s
  // context from `../dialog/dialog-context`, `DropdownMenu`/`ContextMenu`/
  // `Menubar`'s triggers read `Menu`'s, `NavigationMenu`/`Drawer` read their
  // own equivalents (see each file's doc comment: "same cross-folder
  // relative-import pattern DropdownMenu uses for Menu's context"). With
  // `splitting: false`, tsup bundles each `entry` fully self-contained, so a
  // relatively-imported shared module like `dialog-context.ts` gets inlined
  // — and its module-level `React.createContext()` call re-run — separately
  // in *both* `dist/dialog/index.js` and `dist/alert-dialog/index.js`,
  // producing two distinct Context objects from React's point of view. A
  // consumer that mixes `Dialog`'s exports (trigger/portal/etc.) with
  // `AlertDialogContent` then fails with "must be used within Dialog" even
  // though they're correctly nested — the two entries' copies of that
  // Provider/consumer pair don't refer to the same Context. `splitting:
  // true` lets tsup/rollup extract shared modules like this into one
  // chunk file that every entry importing it references, so there's only
  // ever one `createContext()` call for a shared context, no matter how
  // many public subpaths end up needing it.
  splitting: true,
  clean: true,
  treeshake: true,
  external: ['react', 'react-dom', '@nebula/hooks', '@nebula/primitives'],
});
