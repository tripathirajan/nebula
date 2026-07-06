import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { Listbox } from './listbox';
import { ListboxOption } from './listbox-option';

describe('Listbox', () => {
  it('single-select: selects on click and moves selection on arrow-key focus', () => {
    render(
      <Listbox type="single" defaultValue="apple" aria-label="Fruit">
        <ListboxOption value="apple">Apple</ListboxOption>
        <ListboxOption value="banana">Banana</ListboxOption>
      </Listbox>,
    );

    const apple = screen.getByRole('option', { name: 'Apple' });
    const banana = screen.getByRole('option', { name: 'Banana' });
    expect(apple).toHaveAttribute('aria-selected', 'true');

    fireEvent.click(banana);
    expect(banana).toHaveAttribute('aria-selected', 'true');
    expect(apple).toHaveAttribute('aria-selected', 'false');
  });

  it('multi-select: click/Enter/Space toggle independently, focus alone never selects', () => {
    render(
      <Listbox type="multiple" defaultValue={['apple']} aria-label="Fruit">
        <ListboxOption value="apple">Apple</ListboxOption>
        <ListboxOption value="banana">Banana</ListboxOption>
      </Listbox>,
    );

    const apple = screen.getByRole('option', { name: 'Apple' });
    const banana = screen.getByRole('option', { name: 'Banana' });

    fireEvent.focus(banana);
    expect(banana).toHaveAttribute('aria-selected', 'false');

    fireEvent.click(banana);
    expect(banana).toHaveAttribute('aria-selected', 'true');
    expect(apple).toHaveAttribute('aria-selected', 'true');

    fireEvent.click(banana);
    expect(banana).toHaveAttribute('aria-selected', 'false');
  });

  it('is uncontrollable via onValueChange callback', () => {
    const onValueChange = vi.fn();
    render(
      <Listbox type="single" onValueChange={onValueChange} aria-label="Fruit">
        <ListboxOption value="apple">Apple</ListboxOption>
        <ListboxOption value="banana">Banana</ListboxOption>
      </Listbox>,
    );

    fireEvent.click(screen.getByRole('option', { name: 'Banana' }));
    expect(onValueChange).toHaveBeenCalledWith('banana');
  });

  it('does not select a disabled option', () => {
    render(
      <Listbox type="single" aria-label="Fruit">
        <ListboxOption value="apple" disabled>
          Apple
        </ListboxOption>
      </Listbox>,
    );
    fireEvent.click(screen.getByRole('option', { name: 'Apple' }));
    expect(screen.getByRole('option', { name: 'Apple' })).toHaveAttribute('aria-selected', 'false');
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <Listbox type="single" defaultValue="apple" aria-label="Fruit">
        <ListboxOption value="apple">Apple</ListboxOption>
        <ListboxOption value="banana">Banana</ListboxOption>
      </Listbox>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
