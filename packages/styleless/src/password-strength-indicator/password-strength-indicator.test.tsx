import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { getPasswordStrength, PasswordStrengthIndicator } from './password-strength-indicator';

describe('getPasswordStrength', () => {
  it('scores an empty password as 0', () => {
    expect(getPasswordStrength('')).toBe(0);
  });

  it('scores a short, single-character-class password low', () => {
    expect(getPasswordStrength('abc')).toBe(0);
  });

  it('scores a long password with mixed case, digits, and symbols as 4', () => {
    expect(getPasswordStrength('Abcdefgh123!')).toBe(4);
  });

  it('never exceeds the max score', () => {
    expect(getPasswordStrength('SuperLongPassword123!@#$%^&*')).toBe(4);
  });
});

describe('PasswordStrengthIndicator (styleless)', () => {
  it('exposes the score and label via role="meter"', () => {
    render(<PasswordStrengthIndicator password="Abcdefgh123!" />);
    const meter = screen.getByRole('meter');
    expect(meter).toHaveAttribute('aria-valuenow', '4');
    expect(meter).toHaveAttribute('aria-valuemin', '0');
    expect(meter).toHaveAttribute('aria-valuemax', '4');
    expect(meter).toHaveAttribute('aria-valuetext', 'Very strong');
    expect(screen.getByText('Very strong')).toBeInTheDocument();
  });

  it('marks only the segments up to the score as data-filled', () => {
    render(<PasswordStrengthIndicator password="abc" />);
    const meter = screen.getByRole('meter');
    const segments = Array.from(meter.children);
    expect(segments).toHaveLength(4);
    expect(segments.every((segment) => !segment.hasAttribute('data-filled'))).toBe(true);
  });

  it('accepts custom labels', () => {
    render(<PasswordStrengthIndicator password="" labels={['Nope', 'Meh', 'OK', 'Good', 'Great']} />);
    expect(screen.getByText('Nope')).toBeInTheDocument();
  });

  it('applies per-part classNames', () => {
    render(
      <PasswordStrengthIndicator
        password="abc"
        classNames={{ root: 'root-class', track: 'track-class', label: 'label-class' }}
      />,
    );
    expect(screen.getByRole('meter').className).toBe('track-class');
    expect(screen.getByText('Very weak').className).toBe('label-class');
  });
});
