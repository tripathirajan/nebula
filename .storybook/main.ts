import tailwindcss from '@tailwindcss/vite';
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  // Every package's stories live next to their component
  // (packages/<pkg>/src/**/*.stories.tsx) — add new packages automatically
  // via this glob, no per-package registration needed.
  stories: ['../packages/*/src/**/*.stories.@(ts|tsx|mdx)', '../packages/*/src/**/*.mdx'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
  ],
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
    });
  },
};

export default config;
