import type { Preview } from '@storybook/react';

import './tailwind.css';

// Named desktop/tablet/mobile viewports for `addon-essentials`' viewport
// toolbar — without these, the addon only offers its own generic
// mobile1/mobile2/tablet presets and no desktop size, so reviewing a block
// meant to be seen at desktop width (most of `react-ui-blocks`) required
// switching to "reset"/full-canvas by hand instead of picking a size from
// the toolbar. `default: undefined` (below) deliberately leaves the canvas
// at its natural full-width size rather than defaulting every story to one
// of these three — most components aren't viewport-specific, and forcing a
// default would make every story open cramped until manually reset.
const VIEWPORTS = {
  desktop: {
    name: 'Desktop',
    styles: { width: '1440px', height: '900px' },
    type: 'desktop',
  },
  tablet: {
    name: 'Tablet',
    styles: { width: '768px', height: '1024px' },
    type: 'tablet',
  },
  mobile: {
    name: 'Mobile',
    styles: { width: '375px', height: '812px' },
    type: 'mobile',
  },
} as const;

// Global light/dark toggle in Storybook's own toolbar (next to the
// viewport picker) — sets `data-theme` on the preview iframe's
// `<html>`, the same attribute `ThemeProvider`/`ThemeSwitcher` set at
// runtime, so every story (not just ones that opt in) re-renders in
// whichever theme is picked, no per-story wiring needed. Answers a real
// gap: before this, only a component with its own hand-built toggle (e.g.
// the Design Tokens reference page) could be checked in dark mode inside
// Storybook at all.
const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Light/dark theme',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', icon: 'sun', title: 'Light' },
          { value: 'dark', icon: 'moon', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      document.documentElement.setAttribute('data-theme', context.globals.theme as string);
      return Story();
    },
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      // Fails CI on a11y violations rather than only warning — matches the
      // "zero violations gate" contract in component-library-architecture.md §11.
      test: 'error',
    },
    options: {
      storySort: {
        order: ['Primitives', 'Headless', 'Styleless', 'React UI', 'Blocks'],
      },
    },
    viewport: {
      viewports: VIEWPORTS,
    },
  },
};

export default preview;
