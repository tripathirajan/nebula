import { expect, userEvent, within } from '@storybook/test';


import { RadioGroup } from './radio-group';
import { RadioGroupItem } from './radio-group-item';

import type { Meta, StoryObj } from '@storybook/react';
import type { ComponentProps } from 'react';

const meta = {
  title: 'Headless/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

function DensityGroup(props: ComponentProps<typeof RadioGroup>) {
  return (
    <RadioGroup defaultValue="comfortable" aria-label="Density" {...props}>
      <RadioGroupItem value="compact">Compact</RadioGroupItem>
      <RadioGroupItem value="comfortable">Comfortable</RadioGroupItem>
      <RadioGroupItem value="spacious">Spacious</RadioGroupItem>
    </RadioGroup>
  );
}

export const Default: Story = {
  render: () => <DensityGroup />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const compact = canvas.getByRole('radio', { name: 'Compact' });
    const comfortable = canvas.getByRole('radio', { name: 'Comfortable' });

    await expect(comfortable).toHaveAttribute('aria-checked', 'true');
    await expect(compact).toHaveAttribute('tabindex', '-1');

    await userEvent.click(compact);
    await expect(compact).toHaveAttribute('aria-checked', 'true');
    await expect(comfortable).toHaveAttribute('aria-checked', 'false');
  },
};

export const KeyboardNavigation: Story = {
  render: () => <DensityGroup />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const comfortable = canvas.getByRole('radio', { name: 'Comfortable' });
    const spacious = canvas.getByRole('radio', { name: 'Spacious' });

    comfortable.focus();
    await userEvent.keyboard('{ArrowDown}');

    // Native radio groups select on arrow-key move, not just click.
    await expect(spacious).toHaveFocus();
    await expect(spacious).toHaveAttribute('aria-checked', 'true');
  },
};
