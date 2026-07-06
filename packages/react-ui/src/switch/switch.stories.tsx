import { expect, userEvent, within } from '@storybook/test';
import { useState } from 'react';

import { Switch } from './switch';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Switch> = {
  title: 'React UI/Switch',
  component: Switch,
  parameters: { layout: 'centered' },
};

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
  },
};

export const Disabled: Story = {
  args: { disabled: true, 'aria-label': 'Unavailable setting' },
};
