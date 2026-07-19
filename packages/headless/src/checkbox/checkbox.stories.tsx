import { expect, userEvent, within } from '@storybook/test';
import { useState } from 'react';

import { Checkbox } from './checkbox';

import type { Meta, StoryObj } from '@storybook/react';

/**
 * Headless — no styling, only behavior + ARIA. `@nebula-lab/react-ui` will wrap
 * this in a themed checkmark/box once it exists.
 */
const meta = {
  title: 'Headless/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    function Demo() {
      // Local state is plain `boolean` — this demo only ever toggles, it
      // never sets `'indeterminate'` (see the `Indeterminate` story below
      // for that) — so the handler narrows `CheckedState` down instead of
      // passing `setChecked` directly, which only accepts `boolean`.
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

    checkbox.focus();
    await userEvent.keyboard(' ');
    await expect(checkbox).toHaveAttribute('aria-checked', 'false');
  },
};

export const Indeterminate: Story = {
  args: { checked: 'indeterminate', 'aria-label': 'Select all' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('checkbox')).toHaveAttribute('aria-checked', 'mixed');
  },
};

export const Disabled: Story = {
  args: { disabled: true, 'aria-label': 'Unavailable option' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('checkbox')).toBeDisabled();
  },
};
