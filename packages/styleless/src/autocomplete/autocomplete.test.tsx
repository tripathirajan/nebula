import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';

import { Autocomplete } from './autocomplete';
import { AutocompleteContent } from './autocomplete-content';
import { AutocompleteInput } from './autocomplete-input';
import { AutocompleteItem } from './autocomplete-item';
import { AutocompletePortal } from './autocomplete-portal';

const CITIES = ['Austin', 'Boston'];

function DemoAutocomplete() {
  const [inputValue, setInputValue] = useState('');
  const filtered = CITIES.filter((city) => city.toLowerCase().includes(inputValue.toLowerCase()));

  return (
    <Autocomplete inputValue={inputValue} onInputValueChange={setInputValue}>
      <AutocompleteInput aria-label="City" />
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

describe('Autocomplete', () => {
  it('is Combobox under a different name (renders role="combobox"/"listbox"/"option")', () => {
    render(<DemoAutocomplete />);
    fireEvent.change(screen.getByRole('combobox', { name: 'City' }), {
      target: { value: 'a' },
    });
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Austin' })).toBeInTheDocument();
  });

  it('accepts free text with no matching option', () => {
    render(<DemoAutocomplete />);
    const input = screen.getByRole('combobox', { name: 'City' });
    fireEvent.change(input, { target: { value: 'Nowhere' } });
    expect(input).toHaveValue('Nowhere');
    expect(screen.queryAllByRole('option')).toHaveLength(0);
  });
});
