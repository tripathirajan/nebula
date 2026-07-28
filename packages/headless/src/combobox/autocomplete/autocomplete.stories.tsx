import { expect, userEvent, within } from '@storybook/test';
import { useState } from 'react';


import { Autocomplete } from './autocomplete';
import { AutocompleteContent } from './autocomplete-content';
import { AutocompleteInput } from './autocomplete-input';
import { AutocompleteItem } from './autocomplete-item';
import { AutocompletePortal } from './autocomplete-portal';

import type { Meta, StoryObj } from '@storybook/react';

const CITIES = ['Austin', 'Atlanta', 'Boston', 'Chicago'];

const meta = {
  title: 'Headless/Autocomplete',
  component: Autocomplete,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Autocomplete>;

export default meta;
type Story = StoryObj<typeof meta>;

function CityAutocomplete() {
  const [inputValue, setInputValue] = useState('');
  const filtered = CITIES.filter((city) => city.toLowerCase().includes(inputValue.toLowerCase()));

  return (
    <Autocomplete inputValue={inputValue} onInputValueChange={setInputValue}>
      <AutocompleteInput aria-label="City" placeholder="Search cities…" />
      <AutocompletePortal>
        <AutocompleteContent>
          {filtered.map((city) => (
            <AutocompleteItem key={city} value={city}>
              {city}
            </AutocompleteItem>
          ))}
        </AutocompleteContent>
      </AutocompletePortal>
    </Autocomplete>
  );
}

export const Default: Story = {
  render: () => <CityAutocomplete />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('combobox', { name: 'City' });

    await userEvent.type(input, 'a');
    await expect(canvas.getByRole('option', { name: 'Austin' })).toBeInTheDocument();
    await expect(canvas.getByRole('option', { name: 'Atlanta' })).toBeInTheDocument();
    await expect(canvas.queryByRole('option', { name: 'Boston' })).not.toBeInTheDocument();
  },
};

export const FreeTextAllowed: Story = {
  name: 'Accepts text with no matching option',
  render: () => <CityAutocomplete />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('combobox', { name: 'City' });

    await userEvent.type(input, 'Nowhere');
    await expect(input).toHaveValue('Nowhere');
    await expect(canvas.queryAllByRole('option')).toHaveLength(0);
  },
};
