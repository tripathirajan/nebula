import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { OTPInput } from './otp-input';
import { OTPInputSlot } from './otp-input-slot';

function DemoOTPInput({ length = 4, ...props }: Partial<React.ComponentProps<typeof OTPInput>>) {
  return (
    <OTPInput length={length} {...props}>
      {Array.from({ length }, (_, index) => (
        <OTPInputSlot key={index} index={index} aria-label={`Digit ${index + 1}`} />
      ))}
    </OTPInput>
  );
}

describe('OTPInput', () => {
  it('typing a character auto-advances to the next slot', () => {
    render(<DemoOTPInput />);
    const first = screen.getByRole('textbox', { name: 'Digit 1' });
    const second = screen.getByRole('textbox', { name: 'Digit 2' });

    fireEvent.change(first, { target: { value: '1' } });
    expect(first).toHaveValue('1');
    expect(second).toHaveFocus();
  });

  it('Backspace on an empty slot moves back and clears the previous digit', () => {
    render(<DemoOTPInput defaultValue="12" />);
    const first = screen.getByRole('textbox', { name: 'Digit 1' });
    const second = screen.getByRole('textbox', { name: 'Digit 2' });

    second.focus();
    fireEvent.change(second, { target: { value: '' } });
    fireEvent.keyDown(second, { key: 'Backspace' });

    expect(first).toHaveValue('');
    expect(first).toHaveFocus();
  });

  it('pasting a full code distributes it across the slots', () => {
    render(<DemoOTPInput />);
    const first = screen.getByRole('textbox', { name: 'Digit 1' });

    fireEvent.paste(first, {
      clipboardData: { getData: () => '5678' },
    });

    expect(screen.getByRole('textbox', { name: 'Digit 1' })).toHaveValue('5');
    expect(screen.getByRole('textbox', { name: 'Digit 2' })).toHaveValue('6');
    expect(screen.getByRole('textbox', { name: 'Digit 3' })).toHaveValue('7');
    expect(screen.getByRole('textbox', { name: 'Digit 4' })).toHaveValue('8');
  });

  it('ArrowLeft/ArrowRight move between slots', () => {
    render(<DemoOTPInput />);
    const first = screen.getByRole('textbox', { name: 'Digit 1' });
    const second = screen.getByRole('textbox', { name: 'Digit 2' });

    first.focus();
    fireEvent.keyDown(first, { key: 'ArrowRight' });
    expect(second).toHaveFocus();

    fireEvent.keyDown(second, { key: 'ArrowLeft' });
    expect(first).toHaveFocus();
  });

  it('calls onValueChange with the full code', () => {
    const onValueChange = vi.fn();
    render(<DemoOTPInput onValueChange={onValueChange} />);
    fireEvent.change(screen.getByRole('textbox', { name: 'Digit 1' }), {
      target: { value: '1' },
    });
    expect(onValueChange).toHaveBeenCalledWith('1');
  });

  it('has no axe violations', async () => {
    const { container } = render(<DemoOTPInput />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
