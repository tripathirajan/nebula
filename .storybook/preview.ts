import type { Preview } from '@storybook/react';

import './tailwind.css';

const preview: Preview = {
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
  },
};

export default preview;
