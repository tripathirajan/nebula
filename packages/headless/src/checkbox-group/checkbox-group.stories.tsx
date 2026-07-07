import { expect, userEvent, within } from '@storybook/test';

import { CheckboxGroup } from './checkbox-group';
import { CheckboxGroupItem } from './checkbox-group-item';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Headless/CheckboxGroup',
  component: CheckboxGroup,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof CheckboxGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <CheckboxGroup defaultValue={['red']} aria-label="Favorite colors">
      <CheckboxGroupItem value="red">Red</CheckboxGroupItem>
      <CheckboxGroupItem value="green">Green</CheckboxGroupItem>
      <CheckboxGroupItem value="blue">Blue</CheckboxGroupItem>
    </CheckboxGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const red = canvas.getByRole('checkbox', { name: 'Red' });
    const blue = canvas.getByRole('checkbox', { name: 'Blue' });

    await expect(red).toHaveAttribute('aria-checked', 'true');
    await expect(blue).toHaveAttribute('aria-checked', 'false');

    await userEvent.click(blue);
    await expect(blue).toHaveAttribute('aria-checked', 'true');
    // Checking one item doesn't uncheck the others (unlike a RadioGroup).
    await expect(red).toHaveAttribute('aria-checked', 'true');
  },
};
