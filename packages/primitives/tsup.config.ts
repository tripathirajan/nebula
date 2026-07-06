import { defineConfig } from 'tsup';

// One entry per component/module (see component-library-architecture.md §9.1) —
// never a single bundled entry, so consumers can import per-component subpaths
// and bundlers can tree-shake accordingly.
export default defineConfig({
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
    'flex/index': 'src/flex/index.ts',
    'grid/index': 'src/grid/index.ts',
    'stack/index': 'src/stack/index.ts',
    'vstack/index': 'src/vstack/index.ts',
    'inline/index': 'src/inline/index.ts',
    'hstack/index': 'src/hstack/index.ts',
    'wrap/index': 'src/wrap/index.ts',
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
  sourcemap: true,
  splitting: false,
  clean: true,
  treeshake: true,
  external: ['react', 'react-dom'],
});
