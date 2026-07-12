import { ThemeProvider } from '@nebula/react-ui';
import { expect, userEvent, within } from '@storybook/test';

import { ThemeSwitcher } from './theme-switcher';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Blocks/Core/Theme Switcher',
  component: ThemeSwitcher,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof ThemeSwitcher>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SwitchesTheme: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const darkButton = canvas.getByRole('button', { name: 'Dark' });

    await userEvent.click(darkButton);
    await expect(darkButton).toHaveAttribute('aria-pressed', 'true');
  },
};
