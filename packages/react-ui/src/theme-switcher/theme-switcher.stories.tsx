import { ThemeProvider } from '@nebula/react-ui/theme-provider';
import { expect, userEvent, within } from '@storybook/test';

import { ThemeSwitcher } from './theme-switcher';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'React UI/ThemeSwitcher',
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

export const IconVariant: Story = {
  args: { variant: 'icon' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const darkButton = canvas.getByRole('button', { name: 'Dark' });

    await userEvent.click(darkButton);
    await expect(darkButton).toHaveAttribute('aria-pressed', 'true');
  },
};

export const DropdownVariant: Story = {
  name: 'Dropdown variant',
  args: { variant: 'dropdown' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Theme: System' });

    await userEvent.click(trigger);
    const body = within(document.body);
    await expect(await body.findByRole('menuitemradio', { name: 'System' })).toHaveAttribute(
      'aria-checked',
      'true',
    );

    await userEvent.click(body.getByRole('menuitemradio', { name: 'Dark' }));
    await expect(await canvas.findByRole('button', { name: 'Theme: Dark' })).toBeInTheDocument();
  },
};
