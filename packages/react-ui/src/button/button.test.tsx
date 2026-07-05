import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { Button } from './button';

describe('Button (ui)', () => {
  it('applies the primary/md variant classes by default', () => {
    render(<Button>Save</Button>);
    const button = screen.getByRole('button', { name: 'Save' });
    // `cn()` (clsx + tailwind-merge) may reformat the class string, so assert
    // on the variant-identifying fragments rather than an exact string match.
    expect(button.className).toContain('bg-[var(--button-primary-bg)]');
    expect(button.className).toContain('h-10'); // md size
  });

  it('applies the requested variant/size classes', () => {
    render(
      <Button variant="danger" size="lg">
        Delete
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Delete' });
    expect(button.className).toContain('bg-[var(--button-danger-bg)]');
    expect(button.className).toContain('h-12'); // lg size
  });

  it('sets aria-busy and data-loading, and disables the button, while loading', () => {
    render(<Button loading>Deleting…</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toHaveAttribute('data-loading', '');
    expect(button).toBeDisabled();
  });

  it('ships a visible focus-visible ring class for WCAG 2.4.7 (Focus Visible)', () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole('button').className).toContain('focus-visible:ring-2');
  });

  it('supports asChild for a link styled as a button', () => {
    render(
      <Button asChild variant="secondary">
        <a href="/">Link button</a>
      </Button>,
    );
    const link = screen.getByRole('link', { name: 'Link button' });
    expect(link.tagName).toBe('A');
    expect(link.className).toContain('bg-[var(--button-secondary-bg)]');
  });

  it('has no axe violations', async () => {
    const { container } = render(<Button>Save changes</Button>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
