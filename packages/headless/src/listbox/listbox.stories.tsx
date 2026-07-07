import { expect, userEvent, within } from '@storybook/test';

import { Listbox } from './listbox';
import { ListboxOption } from './listbox-option';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Headless/Listbox',
  component: Listbox,
  tags: ['autodocs'],
  args: { type: 'single' },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Listbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SingleSelect: Story = {
  render: () => (
    <Listbox type="single" defaultValue="apple" aria-label="Fruit">
      <ListboxOption value="apple">Apple</ListboxOption>
      <ListboxOption value="banana">Banana</ListboxOption>
      <ListboxOption value="cherry">Cherry</ListboxOption>
    </Listbox>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const apple = canvas.getByRole('option', { name: 'Apple' });
    const banana = canvas.getByRole('option', { name: 'Banana' });

    await expect(apple).toHaveAttribute('aria-selected', 'true');
    apple.focus();
    await userEvent.keyboard('{ArrowDown}');
    // Selection follows focus in single-select mode.
    await expect(banana).toHaveFocus();
    await expect(banana).toHaveAttribute('aria-selected', 'true');
  },
};

export const MultiSelect: Story = {
  render: () => (
    <Listbox type="multiple" defaultValue={['apple']} aria-label="Fruit">
      <ListboxOption value="apple">Apple</ListboxOption>
      <ListboxOption value="banana">Banana</ListboxOption>
      <ListboxOption value="cherry">Cherry</ListboxOption>
    </Listbox>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const apple = canvas.getByRole('option', { name: 'Apple' });
    const banana = canvas.getByRole('option', { name: 'Banana' });

    await expect(apple).toHaveAttribute('aria-selected', 'true');
    banana.focus();
    // Focus alone never selects in multi-select mode.
    await expect(banana).toHaveAttribute('aria-selected', 'false');
    await userEvent.keyboard(' ');
    await expect(banana).toHaveAttribute('aria-selected', 'true');
    await expect(apple).toHaveAttribute('aria-selected', 'true');
  },
};
