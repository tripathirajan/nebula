import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { IconButton } from './icon-button';

describe('IconButton (ui)', () => {
  it('applies the default variant / primary color / md size classes by default', () => {
    render(<IconButton aria-label="Settings">*</IconButton>);
    const button = screen.getByRole('button', { name: 'Settings' });
    expect(button.className).toContain('bg-[var(--button-primary-bg)]');
    expect(button.className).toContain('h-10');
  });

  it('applies the requested color and size', () => {
    render(
      <IconButton aria-label="Settings" color="danger" size="sm">
        *
      </IconButton>,
    );
    const button = screen.getByRole('button', { name: 'Settings' });
    expect(button.className).toContain('bg-[var(--button-danger-bg)]');
    expect(button.className).toContain('h-8');
  });

  it('has no axe violations', async () => {
    const { container } = render(<IconButton aria-label="Settings">*</IconButton>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
