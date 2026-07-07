import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { CheckboxGroup } from './checkbox-group';
import { CheckboxGroupItem } from './checkbox-group-item';

describe('CheckboxGroup', () => {
  it('checks/unchecks items independently', () => {
    render(
      <CheckboxGroup defaultValue={['red']} aria-label="Colors">
        <CheckboxGroupItem value="red">Red</CheckboxGroupItem>
        <CheckboxGroupItem value="blue">Blue</CheckboxGroupItem>
      </CheckboxGroup>,
    );

    const red = screen.getByRole('checkbox', { name: 'Red' });
    const blue = screen.getByRole('checkbox', { name: 'Blue' });
    expect(red).toHaveAttribute('aria-checked', 'true');
    expect(blue).toHaveAttribute('aria-checked', 'false');

    fireEvent.click(blue);
    expect(blue).toHaveAttribute('aria-checked', 'true');
    expect(red).toHaveAttribute('aria-checked', 'true');

    fireEvent.click(red);
    expect(red).toHaveAttribute('aria-checked', 'false');
    expect(blue).toHaveAttribute('aria-checked', 'true');
  });

  it('calls onValueChange with the full updated set', () => {
    const onValueChange = vi.fn();
    render(
      <CheckboxGroup defaultValue={['red']} onValueChange={onValueChange} aria-label="Colors">
        <CheckboxGroupItem value="red">Red</CheckboxGroupItem>
        <CheckboxGroupItem value="blue">Blue</CheckboxGroupItem>
      </CheckboxGroup>,
    );

    fireEvent.click(screen.getByRole('checkbox', { name: 'Blue' }));
    expect(onValueChange).toHaveBeenCalledWith(['red', 'blue']);
  });

  it('every item is independently Tab-reachable (no roving tabindex)', () => {
    render(
      <CheckboxGroup aria-label="Colors">
        <CheckboxGroupItem value="red">Red</CheckboxGroupItem>
        <CheckboxGroupItem value="blue">Blue</CheckboxGroupItem>
      </CheckboxGroup>,
    );

    for (const checkbox of screen.getAllByRole('checkbox')) {
      expect(checkbox).not.toHaveAttribute('tabindex', '-1');
    }
  });

  it('disables every item when the group is disabled', () => {
    render(
      <CheckboxGroup disabled aria-label="Colors">
        <CheckboxGroupItem value="red">Red</CheckboxGroupItem>
      </CheckboxGroup>,
    );
    expect(screen.getByRole('checkbox', { name: 'Red' })).toBeDisabled();
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <CheckboxGroup defaultValue={['red']} aria-label="Colors">
        <CheckboxGroupItem value="red">Red</CheckboxGroupItem>
        <CheckboxGroupItem value="blue">Blue</CheckboxGroupItem>
      </CheckboxGroup>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
