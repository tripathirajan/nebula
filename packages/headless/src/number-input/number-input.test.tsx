import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { NumberInput } from './number-input';
import { NumberInputDecrement } from './number-input-decrement';
import { NumberInputField } from './number-input-field';
import { NumberInputIncrement } from './number-input-increment';

function DemoNumberInput(props: React.ComponentProps<typeof NumberInput>) {
  return (
    <NumberInput {...props}>
      <NumberInputDecrement aria-label="Decrease">-</NumberInputDecrement>
      <NumberInputField aria-label="Quantity" />
      <NumberInputIncrement aria-label="Increase">+</NumberInputIncrement>
    </NumberInput>
  );
}

describe('NumberInput', () => {
  it('increments/decrements by step', () => {
    render(<DemoNumberInput defaultValue={1} />);
    const field = screen.getByRole('spinbutton', { name: 'Quantity' });

    fireEvent.click(screen.getByRole('button', { name: 'Increase' }));
    expect(field).toHaveValue(2);

    fireEvent.click(screen.getByRole('button', { name: 'Decrease' }));
    fireEvent.click(screen.getByRole('button', { name: 'Decrease' }));
    expect(field).toHaveValue(0);
  });

  it('clamps to min/max and disables the buttons at the bounds', () => {
    render(<DemoNumberInput defaultValue={5} min={0} max={5} />);
    expect(screen.getByRole('button', { name: 'Increase' })).toBeDisabled();

    fireEvent.click(screen.getByRole('button', { name: 'Decrease' }));
    expect(screen.getByRole('spinbutton', { name: 'Quantity' })).toHaveValue(4);
    expect(screen.getByRole('button', { name: 'Increase' })).not.toBeDisabled();
  });

  it('typing into the field updates the value', () => {
    render(<DemoNumberInput defaultValue={1} />);
    fireEvent.change(screen.getByRole('spinbutton', { name: 'Quantity' }), {
      target: { value: '42' },
    });
    expect(screen.getByRole('spinbutton', { name: 'Quantity' })).toHaveValue(42);
  });

  it('calls onValueChange', () => {
    const onValueChange = vi.fn();
    render(<DemoNumberInput defaultValue={1} onValueChange={onValueChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Increase' }));
    expect(onValueChange).toHaveBeenCalledWith(2);
  });

  it('the stepper buttons are not in the tab sequence', () => {
    render(<DemoNumberInput defaultValue={1} />);
    expect(screen.getByRole('button', { name: 'Increase' })).toHaveAttribute('tabindex', '-1');
    expect(screen.getByRole('button', { name: 'Decrease' })).toHaveAttribute('tabindex', '-1');
  });

  it('has no axe violations', async () => {
    const { container } = render(<DemoNumberInput defaultValue={1} min={0} max={5} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
