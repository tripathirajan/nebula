import tailwindcss from '@tailwindcss/vite';
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  // Every package's stories live next to their component
  // (packages/<pkg>/src/**/*.stories.tsx) — add new packages automatically
  // via this glob, no per-package registration needed.
  stories: ['../packages/*/src/**/*.stories.@(ts|tsx|mdx)', '../packages/*/src/**/*.mdx'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-interactions', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  core: {
    disableTelemetry: true,
  },
  docs: {
    autodocs: 'tag',
  },
  typescript: {
    reactDocgen: 'react-docgen-typescript',
    // Without an explicit `tsconfigPath`, `react-docgen-typescript` falls
    // back to default compiler options with no knowledge of this repo's
    // `@nebula-lab/*` path aliases — every component prop type that's imported
    // across a package boundary (e.g. `PrimitivePropsWithRef` from
    // `@nebula-lab/primitives/primitive`, which is nearly all of them) then
    // fails to resolve, and Storybook silently renders an empty Controls
    // table instead of erroring. Pointing this at the workspace-root
    // `tsconfig.base.json` (which owns the full `@nebula-lab/*` -> `packages/*/src`
    // `paths` map every package's own tsconfig extends) is what lets docgen
    // actually see through those imports.
    reactDocgenTypescriptOptions: {
      tsconfigPath: '../tsconfig.base.json',
      shouldExtractLiteralValuesFromEnum: true,
      shouldRemoveUndefinedFromOptional: true,
      // Every component here is built on `Primitive`, so its prop type is
      // `ComponentPropsWithRef<'div' | 'button' | ...>` plus a handful of
      // its own — left unfiltered, docgen would dump the full ~100-entry
      // native DOM attribute/event-handler list (`onDrag`, `onAnimationEnd`,
      // `suppressHydrationWarning`, ...) into every single component's
      // Controls table, burying the handful of props that actually matter.
      // Keeping only props declared in this repo's own `.tsx`/`.ts` files
      // (i.e. not `node_modules`, which is where `@types/react`'s DOM
      // attribute types live) is the standard fix for exactly this shape of
      // component library (Radix's own docs site does the same). Also drops
      // every `__scope<Name>` prop (`createContextScope`'s internal
      // scope-threading mechanism, present on every compound component built
      // in this repo) — real, but never meant to be set directly by a
      // consumer, so it has no business in a public Controls table.
      propFilter: (prop) =>
        (!prop.parent || !/node_modules/.test(prop.parent.fileName)) && !prop.name.startsWith('__'),
    },
  },
  // Storybook's react-vite framework builds its own Vite instance — it does
  // NOT inherit apps/playground/vite.config.ts (which no longer exists
  // anyway). The `@tailwindcss/vite` plugin has to be registered here
  // directly, or `@import 'tailwindcss'` in tailwind.css is inert and every
  // story renders with theme.css's CSS variables but no generated Tailwind
  // utility classes at all.
  async viteFinal(viteConfig) {
    const { mergeConfig } = await import('vite');
    return mergeConfig(viteConfig, {
      plugins: [tailwindcss()],
      build: {
        // Raise the warning limit so Storybook's preview build doesn't warn
        // unnecessarily for large but expected chunks in a component library.
        chunkSizeWarningLimit: 1000, // in kB
        rollupOptions: {
          output: {
            // Split @nebula packages into their own chunk, and third-party
            // node_modules into `vendor`. This reduces single large bundles
            // and makes caching more effective.
            manualChunks(id: string | undefined) {
              if (!id) return undefined;
              if (id.includes('node_modules')) {
                if (id.includes('@nebula')) return 'nebula';
                return 'vendor';
              }
            },
          },
        },
      },
    });
  },
};

export default config;
