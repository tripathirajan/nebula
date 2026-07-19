import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

// Single root config for the whole workspace, mirroring eslint.config.mjs and
// .storybook — cross-cutting tool config lives at the root once, rather than
// duplicated per package like tsup.config.ts/package.json necessarily are
// (those define per-package build output; this doesn't need to).
//
// Run everything:            pnpm test
// Watch everything:          pnpm test:watch
// Scope to one package:      pnpm --filter @nebula-lab/primitives test
//   (packages that have tests define their own "test" script that filters
//   this same config down to their own path — see that package's package.json)
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: false,
    setupFiles: ['./vitest.setup.ts'],
    include: ['packages/*/src/**/*.test.{ts,tsx}'],
    css: false,
  },
});
