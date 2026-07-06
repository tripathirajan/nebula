import { expect, within } from '@storybook/test';

import { RadioGroup } from './radio-group';
import { RadioGroupItem } from './radio-group-item';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof RadioGroup> = {
  title: 'React UI/RadioGroup',
  component: RadioGroup,
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof meta>;

function DensityGroup() {
  return (
    <RadioGroup defaultValue="comfortable" aria-label="Density">
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
    await expect(canvas.getByRole('radio', { name: 'Comfortable' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
  },
};
