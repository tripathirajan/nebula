import { expect, userEvent, within } from '@storybook/test';
import { useState } from 'react';

import { Switch } from './switch';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Styleless/Switch',
  component: Switch,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    function Demo() {
      const [enabled, setEnabled] = useState(false);
      return <Switch checked={enabled} onCheckedChange={setEnabled} aria-label="Enable notifications" />;
    }
    return <Demo />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole('switch');

    await expect(toggle).toHaveAttribute('aria-checked', 'false');
    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute('aria-checked', 'true');

    toggle.focus();
    await userEvent.keyboard(' ');
    await expect(toggle).toHaveAttribute('aria-checked', 'false');
  },
};

export const Disabled: Story = {
  args: { disabled: true, 'aria-label': 'Unavailable setting' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('switch')).toBeDisabled();
  },
};
