import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { Label } from './label';

describe('Label (ui)', () => {
  it('renders a label associated with htmlFor', () => {
    render(<Label htmlFor="field">Email</Label>);
    expect(screen.getByText('Email').tagName).toBe('LABEL');
    expect(screen.getByText('Email')).toHaveAttribute('for', 'field');
  });

  it('applies the field-label text treatment', () => {
    render(<Label htmlFor="field">Email</Label>);
    expect(screen.getByText('Email').className).toContain('text-[var(--field-label-text)]');
  });

  it('announces required state to screen readers', () => {
    render(
      <Label htmlFor="field" required>
        Email
      </Label>,
    );
    expect(screen.getByText('(required)')).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(<Label htmlFor="field">Email</Label>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
