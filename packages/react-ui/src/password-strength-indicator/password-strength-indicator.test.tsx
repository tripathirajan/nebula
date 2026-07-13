import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { PasswordStrengthIndicator } from './password-strength-indicator';

describe('PasswordStrengthIndicator', () => {
  it('renders the meter with the correct score and label', () => {
    render(<PasswordStrengthIndicator password="Abcdefgh123!" />);
    const meter = screen.getByRole('meter');
    expect(meter).toHaveAttribute('aria-valuenow', '4');
    expect(screen.getByText('Very strong')).toBeInTheDocument();
  });

  it('applies a custom className to the root', () => {
    render(<PasswordStrengthIndicator password="abc" className="custom-indicator" />);
    expect(screen.getByRole('meter').closest('.custom-indicator')).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(<PasswordStrengthIndicator password="Abcdefgh123!" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
