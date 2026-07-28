import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { Checkbox } from './checkbox';

describe('Checkbox (ui)', () => {
  it('renders the headless behavior unchanged (toggles on click)', () => {
    render(<Checkbox defaultChecked={false} aria-label="Accept terms" />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('aria-checked', 'false');

    fireEvent.click(checkbox);
    expect(checkbox).toHaveAttribute('aria-checked', 'true');
  });

  it('applies the token classes', () => {
    render(<Checkbox aria-label="Accept terms" />);
    expect(screen.getByRole('checkbox').className).toContain('bg-[var(--checkbox-bg)]');
  });

  it('shows the indeterminate dash icon in indeterminate state', () => {
    render(<Checkbox checked="indeterminate" aria-label="Select all" />);
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'mixed');
  });

  it('has no axe violations', async () => {
    const { container } = render(<Checkbox aria-label="Accept terms" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
