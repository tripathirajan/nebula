import { TokenReference } from './token-reference';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof TokenReference> = {
  title: 'Design Tokens/Reference',
  component: TokenReference,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Every CSS custom property nebula\'s token layer emits to `theme.css` — colors, shadows, radius, size, font, motion, z-index, and every per-component `--<component>-*` token — grouped and named the same way `tokens/generate.ts` groups them, read live from `primitiveTokens`/`semanticTokens`/`componentTokens` so a new token shows up here automatically. Each row shows the real computed value (via `getComputedStyle`), not just the source string, so a bug in `generate.ts` would show up here too. Toggle the button at the top to compare light/dark.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Reference: Story = {};
