import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Toggle } from './toggle';

describe('Toggle', () => {
  it('defaults to unpressed', () => {
    render(<Toggle aria-label="Bold" />);
    expect(screen.getByRole('button', { name: 'Bold' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('toggles aria-pressed on click', () => {
    render(<Toggle aria-label="Bold" />);
    const toggle = screen.getByRole('button', { name: 'Bold' });

    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-pressed', 'false');
  });

  it('respects defaultPressed', () => {
    render(<Toggle aria-label="Bold" defaultPressed />);
    expect(screen.getByRole('button', { name: 'Bold' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('is controllable via pressed/onPressedChange', () => {
    const onPressedChange = vi.fn();
    render(<Toggle aria-label="Bold" pressed={false} onPressedChange={onPressedChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Bold' }));

    expect(onPressedChange).toHaveBeenCalledWith(true);
    // Controlled: stays false since the consumer didn't update the `pressed` prop.
    expect(screen.getByRole('button', { name: 'Bold' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('does not toggle when disabled', () => {
    render(<Toggle aria-label="Bold" disabled />);
    const toggle = screen.getByRole('button', { name: 'Bold' });
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-pressed', 'false');
    expect(toggle).toBeDisabled();
  });

  it('sets data-state to match pressed', () => {
    render(<Toggle aria-label="Bold" defaultPressed />);
    expect(screen.getByRole('button', { name: 'Bold' })).toHaveAttribute('data-state', 'on');
  });
});
