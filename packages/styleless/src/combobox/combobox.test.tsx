import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { Combobox } from './combobox';
import { ComboboxContent } from './combobox-content';
import { ComboboxInput } from './combobox-input';
import { ComboboxItem } from './combobox-item';
import { ComboboxPortal } from './combobox-portal';

const FRUITS = ['Apple', 'Apricot', 'Banana'];

function DemoCombobox() {
  const [inputValue, setInputValue] = useState('');
  const filtered = FRUITS.filter((fruit) => fruit.toLowerCase().includes(inputValue.toLowerCase()));

  return (
    <Combobox inputValue={inputValue} onInputValueChange={setInputValue}>
      <ComboboxInput aria-label="Fruit" />
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

describe('Combobox', () => {
  it('is closed initially', () => {
    render(<DemoCombobox />);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('typing opens the popup and filters options', () => {
    render(<DemoCombobox />);
    const input = screen.getByRole('combobox', { name: 'Fruit' });

    fireEvent.change(input, { target: { value: 'ap' } });
    expect(screen.getByRole('option', { name: 'Apple' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Apricot' })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'Banana' })).not.toBeInTheDocument();
  });

  it('clicking an option fills the input and closes the popup', async () => {
    render(<DemoCombobox />);
    const input = screen.getByRole('combobox', { name: 'Fruit' });
    fireEvent.change(input, { target: { value: 'ban' } });

    fireEvent.click(screen.getByRole('option', { name: 'Banana' }));
    await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument());
    expect(input).toHaveValue('Banana');
  });

  it('ArrowDown highlights options and Enter selects the highlighted one without moving focus', () => {
    render(<DemoCombobox />);
    const input = screen.getByRole('combobox', { name: 'Fruit' });
    input.focus();
    fireEvent.change(input, { target: { value: 'ap' } });

    fireEvent.keyDown(input, { key: 'ArrowDown' });
    const apple = screen.getByRole('option', { name: 'Apple' });
    expect(input).toHaveAttribute('aria-activedescendant', apple.id);

    fireEvent.keyDown(input, { key: 'Enter' });
    expect(input).toHaveValue('Apple');
    expect(input).toHaveFocus();
  });

  it('Escape closes the popup without clearing the input', () => {
    render(<DemoCombobox />);
    const input = screen.getByRole('combobox', { name: 'Fruit' });
    fireEvent.change(input, { target: { value: 'ap' } });
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    fireEvent.keyDown(input, { key: 'Escape' });
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(input).toHaveValue('ap');
  });

  it('has no axe violations', async () => {
    const { container } = render(<DemoCombobox />);
    fireEvent.change(screen.getByRole('combobox', { name: 'Fruit' }), {
      target: { value: 'a' },
    });
    expect(await axe(container)).toHaveNoViolations();
  });
});
