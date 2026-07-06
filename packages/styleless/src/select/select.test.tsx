import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { Select } from './select';
import { SelectContent } from './select-content';
import { SelectItem } from './select-item';
import { SelectPortal } from './select-portal';
import { SelectTrigger } from './select-trigger';
import { SelectValue } from './select-value';

function DemoSelect(props: React.ComponentProps<typeof Select>) {
  return (
    <Select {...props}>
      <SelectTrigger>
        <SelectValue placeholder="Pick a fruit" />
      </SelectTrigger>
      <SelectPortal>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
        </SelectContent>
      </SelectPortal>
    </Select>
  );
}

describe('Select', () => {
  it('is closed initially and shows the placeholder', () => {
    render(<DemoSelect />);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveTextContent('Pick a fruit');
  });

  it('opens on trigger click with aria-haspopup="listbox"', () => {
    render(<DemoSelect />);
    const trigger = screen.getByRole('button');
    expect(trigger).toHaveAttribute('aria-haspopup', 'listbox');

    fireEvent.click(trigger);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('selecting an item updates SelectValue and closes the popup', async () => {
    render(<DemoSelect />);
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByRole('option', { name: 'Banana' }));

    await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument());
    expect(screen.getByRole('button')).toHaveTextContent('Banana');
  });

  it('calls onValueChange with the selected value', () => {
    const onValueChange = vi.fn();
    render(<DemoSelect onValueChange={onValueChange} />);
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByRole('option', { name: 'Apple' }));
    expect(onValueChange).toHaveBeenCalledWith('apple');
  });

  it('respects defaultValue and displays its label immediately', () => {
    render(<DemoSelect defaultValue="apple" />);
    expect(screen.getByRole('button')).toHaveTextContent('Apple');
  });

  it('closes on Escape and restores focus to the trigger', async () => {
    render(<DemoSelect />);
    const trigger = screen.getByRole('button');
    trigger.focus();
    fireEvent.click(trigger);
    await waitFor(() => expect(screen.getByRole('listbox')).toBeInTheDocument());

    fireEvent.keyDown(document, { key: 'Escape' });
    await waitFor(() => {
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      expect(trigger).toHaveFocus();
    });
  });

  it('mirrors the value onto a visually-hidden native <select> when name is given', () => {
    const { container } = render(<DemoSelect name="fruit" defaultValue="apple" />);
    const nativeSelect = container.querySelector('select[name="fruit"]');
    expect(nativeSelect).not.toBeNull();
    expect((nativeSelect as HTMLSelectElement).value).toBe('apple');
  });

  it('has no axe violations', async () => {
    const { container } = render(<DemoSelect />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
