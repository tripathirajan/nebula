import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { Button } from './button';

describe('Button (ui)', () => {
  it('applies the default variant / primary color / md size classes by default', () => {
    render(<Button>Save</Button>);
    const button = screen.getByRole('button', { name: 'Save' });
    // `cn()` (clsx + tailwind-merge) may reformat the class string, so assert
    // on the variant-identifying fragments rather than an exact string match.
    expect(button.className).toContain('bg-[var(--button-primary-bg)]');
    expect(button.className).toContain('h-10'); // md size
  });

  it('applies the requested color/size classes', () => {
    render(
      <Button color="danger" size="lg">
        Delete
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Delete' });
    expect(button.className).toContain('bg-[var(--button-danger-bg)]');
    expect(button.className).toContain('h-12'); // lg size
  });

  it('ghost variant renders a colored border with no filled background', () => {
    render(
      <Button variant="ghost" color="danger">
        Delete
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Delete' });
    expect(button.className).toContain('border-[var(--button-danger-border)]');
    expect(button.className).not.toContain('text-[var(--button-danger-text)]');
  });

  it("ghost/text danger variants read the contrast-safe --color-error-text token, not the raw --button-danger-border hue", () => {
    render(
      <>
        <Button variant="ghost" color="danger">
          Ghost delete
        </Button>
        <Button variant="text" color="danger">
          Text delete
        </Button>
      </>,
    );
    expect(screen.getByRole('button', { name: 'Ghost delete' }).className).toContain(
      'text-[var(--color-error-text)]',
    );
    expect(screen.getByRole('button', { name: 'Text delete' }).className).toContain('text-[var(--color-error-text)]');
  });

  it('text variant renders colored text with no border or filled background', () => {
    render(
      <Button variant="text" color="primary">
        Learn more
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Learn more' });
    const classes = button.className.split(' ');
    expect(classes).toContain('text-[var(--button-primary-border)]');
    expect(classes).toContain('border-transparent');
    // Only the hover-only tinted fill should be present, not a base bg class.
    expect(classes).not.toContain('bg-[var(--button-primary-bg)]');
  });

  it('link variant renders like text plus an underline on hover', () => {
    render(
      <Button variant="link" color="primary">
        Learn more
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Learn more' });
    expect(button.className).toContain('hover:underline');
    expect(button.className).toContain('text-[var(--button-primary-border)]');
  });

  it('ghost + neutral reproduces the old colorless "Google sign-in" look, not the secondary hue', () => {
    render(
      <Button variant="ghost" color="neutral">
        Continue with Google
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Continue with Google' });
    expect(button.className).toContain('border-[var(--button-neutral-border)]');
    expect(button.className).not.toContain('--button-secondary-');
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
      <Button asChild color="secondary">
        <a href="/">Link button</a>
      </Button>,
    );
    const link = screen.getByRole('link', { name: 'Link button' });
    expect(link.tagName).toBe('A');
    // `color="secondary"` now resolves to the true bold DaisyUI secondary
    // hue (`--color-secondary`), not the old neutral-gray alias.
    expect(link.className).toContain('bg-[var(--button-secondary-bg)]');
  });

  it('has no axe violations', async () => {
    const { container } = render(<Button>Save changes</Button>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
