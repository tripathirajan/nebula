import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { IconButton } from './icon-button';

describe('IconButton (ui)', () => {
  it('applies the text variant / neutral color / md size classes by default', () => {
    render(<IconButton aria-label="Settings">*</IconButton>);
    const button = screen.getByRole('button', { name: 'Settings' });
    expect(button.className).toContain('text-[var(--button-neutral-border)]');
    expect(button.className).toContain('h-10');
  });

  it('applies the requested color and size', () => {
    render(
      <IconButton aria-label="Settings" color="danger" size="sm">
        *
      </IconButton>,
    );
    const button = screen.getByRole('button', { name: 'Settings' });
    expect(button.className).toContain('text-[var(--button-danger-border)]');
    expect(button.className).toContain('h-8');
  });

  it('applies an explicit filled default variant', () => {
    render(
      <IconButton aria-label="Settings" variant="default" color="primary">
        *
      </IconButton>,
    );
    const button = screen.getByRole('button', { name: 'Settings' });
    expect(button.className).toContain('bg-[var(--button-primary-bg)]');
  });

  it('has no axe violations', async () => {
    const { container } = render(<IconButton aria-label="Settings">*</IconButton>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
