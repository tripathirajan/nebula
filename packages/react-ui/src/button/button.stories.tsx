import { expect, fn, userEvent, within } from '@storybook/test';

import { Button } from './button';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'React UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    // theme.css must be loaded for the CSS-var-backed variants to render
    // meaningfully — see .storybook/preview.ts.
  },
  args: { onClick: fn() },
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'danger'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { variant: 'primary', children: 'Save changes' },
};

export const Secondary: Story = {
  args: { variant: 'secondary', children: 'Cancel' },
};

export const Danger: Story = {
  args: { variant: 'danger', children: 'Delete account' },
};

export const Loading: Story = {
  args: { variant: 'primary', loading: true, children: 'Saving…' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    await expect(button).toBeDisabled();
    await expect(button).toHaveAttribute('aria-busy', 'true');
  },
};

export const Disabled: Story = {
  args: { variant: 'primary', disabled: true, children: "Can't click me" },
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
