import { expect, userEvent, within } from '@storybook/test';
import { useState } from 'react';

import { Checkbox } from './checkbox';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Checkbox> = {
  title: 'React UI/Checkbox',
  component: Checkbox,
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    function Demo() {
      const [checked, setChecked] = useState(false);
      return (
        <Checkbox
          checked={checked}
          onCheckedChange={(next) => setChecked(next === true)}
          aria-label="Accept terms"
        />
      );
    }
    return <Demo />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole('checkbox');

    await expect(checkbox).toHaveAttribute('aria-checked', 'false');
    await userEvent.click(checkbox);
    await expect(checkbox).toHaveAttribute('aria-checked', 'true');
  },
};

export const Indeterminate: Story = {
  args: { checked: 'indeterminate', 'aria-label': 'Select all' },
};

export const Disabled: Story = {
  args: { disabled: true, 'aria-label': 'Unavailable option' },
};
