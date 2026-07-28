import { defineConfig } from 'tsup';

// One entry per component/module (see component-library-architecture.md §9.1) —
// never a single bundled entry, so consumers can import per-component subpaths
// and bundlers can tree-shake accordingly.
export default defineConfig((options) => ({
  entry: {
    index: 'src/index.ts',
    'types/index': 'src/types/index.ts',
    'slot/index': 'src/slot/index.ts',
    'primitive/index': 'src/primitive/index.ts',
    'cn/index': 'src/cn/index.ts',
    'compose-refs/index': 'src/compose-refs/index.ts',
    'compose-event-handlers/index': 'src/compose-event-handlers/index.ts',
    'create-context-scope/index': 'src/create-context-scope/index.ts',
    'box/index': 'src/box/index.ts',
    'flex/index': 'src/flex/flex/index.ts',
    'grid/index': 'src/grid/index.ts',
    'stack/index': 'src/flex/stack/index.ts',
    'vstack/index': 'src/flex/vstack/index.ts',
    'inline/index': 'src/flex/inline/index.ts',
    'hstack/index': 'src/flex/hstack/index.ts',
    'wrap/index': 'src/flex/wrap/index.ts',
    'spacer/index': 'src/spacer/index.ts',
    'center/index': 'src/center/index.ts',
    'container/index': 'src/container/index.ts',
    'aspect-ratio/index': 'src/aspect-ratio/index.ts',
    'text/index': 'src/text/index.ts',
    'heading/index': 'src/heading/index.ts',
    'paragraph/index': 'src/paragraph/index.ts',
    'code/index': 'src/code/index.ts',
    'pre/index': 'src/pre/index.ts',
    'link/index': 'src/link/index.ts',
    'image/index': 'src/image/index.ts',
    'visually-hidden/index': 'src/visually-hidden/index.ts',
    'focus-scope/index': 'src/focus-scope/index.ts',
    'dismissible-layer/index': 'src/dismissible-layer/index.ts',
    'boundary/index': 'src/boundary/index.ts',
    'roving-focus-group/index': 'src/roving-focus-group/index.ts',
    'button/index': 'src/button/index.ts',
    'input/index': 'src/input/index.ts',
    'textarea/index': 'src/textarea/index.ts',
    'native-select/index': 'src/native-select/index.ts',
    'label/index': 'src/label/index.ts',
    'form/index': 'src/form/index.ts',
    'portal/index': 'src/portal/index.ts',
    'presence/index': 'src/presence/index.ts',
    'overlay/index': 'src/overlay/index.ts',
    'popper/index': 'src/popper/index.ts',
  },
  format: ['esm'],
  // Matches tsconfig.base.json's `target` exactly — this workspace only
  // supports React 19 (see peerDependencies), so there's no reason to let
  // esbuild's default (lower, broad-compat) target down-level output for
  // runtimes this package was never going to support anyway.
  target: 'es2022',
  // dts generation is done as a separate `tsc --emitDeclarationOnly` pass
  // (see package.json's `build` script + tsconfig.build.json), not by tsup's
  // built-in `dts: true`. With 30+ entries all referencing the heavy
  // recursive `PolymorphicComponentPropsWithRef<E>` generic, tsup's dts
  // worker (rollup-plugin-dts) reliably OOMs — a long-standing, unresolved
  // upstream issue: https://github.com/egoist/tsup/issues/920. Plain `tsc`
  // has no such worker-memory ceiling and produces equivalent per-entry
  // .d.ts output since tsconfig.json already mirrors src/ 1:1 into dist/.
  dts: false,
  sourcemap: !!options.watch, // maps are dev/debug DX weight only, not needed by consumers; skip them for the real publish build, keep them under `tsup --watch` (this package's `dev` script) for local debugging
  // `splitting: false` here used to mean every one of the 30+ entries above
  // bundled its own fully self-contained copy of any module it pulled in via
  // a relative import — including `slot.tsx`, which `primitive.tsx` imports
  // relatively (`../slot/slot`) to power `asChild`. That module-level
  // `Slottable = ({children}) => <>...</>` and `isSlottable` pair got
  // re-instantiated separately in *both* `dist/primitive/index.js` and
  // `dist/slot/index.js` (confirmed by grepping both files: each has its own
  // `var Slottable = ...`), producing two distinct function references. A
  // consumer importing `Slottable` from `@nebula-lab/primitives/slot` and
  // using it inside a component built on `Primitive`'s `asChild` (from
  // `@nebula-lab/primitives/primitive`) — exactly `BottomNavItem`'s
  // documented icon/label + `asChild` pattern — silently failed
  // `isSlottable`'s `child.type === Slottable` check against the *other*
  // entry's `Slottable`, so `Slot` never found its slotted child and crashed
  // with "React.Children.only expected to receive a single React element
  // child." `headless/tsup.config.ts` already hit and fixed this identical
  // class of bug for its own relatively-imported shared Context modules —
  // same fix here: `splitting: true` lets tsup/rollup extract a module like
  // `slot.tsx` into one shared chunk every entry references, so there's only
  // ever one `Slottable`/`isSlottable`/`Slot`, no matter how many public
  // subpaths pull it in.
  splitting: true,
  clean: true,
  treeshake: true,
  external: ['react', 'react-dom'],
}));
