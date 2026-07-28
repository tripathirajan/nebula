import { expect, userEvent, within } from '@storybook/test';
import { useState } from 'react';

import { Combobox } from './combobox';
import { ComboboxContent } from './combobox-content';
import { ComboboxInput } from './combobox-input';
import { ComboboxItem } from './combobox-item';
import { ComboboxPortal } from './combobox-portal';

import type { Meta, StoryObj } from '@storybook/react';

const FRUITS = ['Apple', 'Apricot', 'Banana', 'Blueberry', 'Cherry'];

const meta = {
  title: 'React UI/Combobox',
  component: Combobox,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;

function FruitCombobox() {
  const [inputValue, setInputValue] = useState('');
  const filtered = FRUITS.filter((fruit) => fruit.toLowerCase().includes(inputValue.toLowerCase()));

  return (
    <Combobox inputValue={inputValue} onInputValueChange={setInputValue}>
      <ComboboxInput aria-label="Fruit" placeholder="Search fruit…" className="w-48" />
      <ComboboxPortal>
        <ComboboxContent>
          {filtered.map((fruit) => (
            <ComboboxItem key={fruit} value={fruit}>
              {fruit}
            </ComboboxItem>
          ))}
        </ComboboxContent>
      </ComboboxPortal>
    </Combobox>
  );
}

export const Default: Story = {
  render: () => <FruitCombobox />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('combobox', { name: 'Fruit' });

    await userEvent.type(input, 'b');
    await expect(canvas.getByRole('option', { name: 'Banana' })).toBeInTheDocument();
    await expect(canvas.queryByRole('option', { name: 'Apple' })).not.toBeInTheDocument();

    await userEvent.click(canvas.getByRole('option', { name: 'Blueberry' }));
    await expect(input).toHaveValue('Blueberry');
  },
};

export const KeyboardNavigation: Story = {
  render: () => <FruitCombobox />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('combobox', { name: 'Fruit' });

    await userEvent.type(input, 'a');
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{Enter}');

    await expect(input).toHaveValue('Apple');
    await expect(input).toHaveFocus();
  },
};
