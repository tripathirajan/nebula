import { expect, fn, userEvent, within } from '@storybook/test';

import { Button } from './button';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Button> = {
  title: 'Styleless/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: { onClick: fn() },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: 'Click me' },
};

export const Loading: Story = {
  args: { loading: true, children: 'Saving…' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    await expect(button).toBeDisabled();
    await expect(button).toHaveAttribute('aria-busy', 'true');
    await expect(button).toHaveAttribute('data-loading', '');
  },
};

export const Disabled: Story = {
  args: { disabled: true, children: "Can't click me" },
};

export const AsChildLink: Story = {
  name: 'asChild renders an anchor',
  render: (args) => (
    <Button {...args} asChild>
      <a href="#nebula">Link styled as a button</a>
    </Button>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const link = canvas.getByRole('link');
    await expect(link.tagName).toBe('A');
    await userEvent.click(link);
  },
};
