import { expect, userEvent, within } from '@storybook/test';

import { Select } from './select';
import { SelectContent } from './select-content';
import { SelectItem } from './select-item';
import { SelectPortal } from './select-portal';
import { SelectTrigger } from './select-trigger';
import { SelectValue } from './select-value';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Styleless/Select',
  component: Select,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

function FruitSelect(props: React.ComponentProps<typeof Select>) {
  return (
    <Select {...props}>
      <SelectTrigger>
        <SelectValue placeholder="Pick a fruit" />
      </SelectTrigger>
      <SelectPortal>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="cherry">Cherry</SelectItem>
        </SelectContent>
      </SelectPortal>
    </Select>
  );
}

export const Default: Story = {
  render: () => <FruitSelect />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button');
    await expect(trigger).toHaveTextContent('Pick a fruit');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');

    const banana = canvas.getByRole('option', { name: 'Banana' });
    await userEvent.click(banana);

    await expect(trigger).toHaveTextContent('Banana');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  },
};

export const WithDefaultValue: Story = {
  render: () => <FruitSelect defaultValue="cherry" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button')).toHaveTextContent('Cherry');
  },
};

export const KeyboardNavigation: Story = {
  render: () => <FruitSelect />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button');

    trigger.focus();
    await userEvent.keyboard('{ArrowDown}');
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');

    await userEvent.keyboard('{Escape}');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(trigger).toHaveFocus();
  },
};
