import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { FAB } from './fab';

describe('FAB (ui)', () => {
  it('applies the default variant / primary color classes by default', () => {
    render(<FAB aria-label="Compose">+</FAB>);
    const button = screen.getByRole('button', { name: 'Compose' });
    expect(button.className).toContain('bg-[var(--button-primary-bg)]');
    expect(button.className).toContain('rounded-full');
  });

  it('applies the requested color', () => {
    render(
      <FAB aria-label="Compose" color="danger">
        +
      </FAB>,
    );
    expect(screen.getByRole('button', { name: 'Compose' }).className).toContain(
      'bg-[var(--button-danger-bg)]',
    );
  });

  it('ghost variant renders a colored border/text with no filled background', () => {
    render(
      <FAB aria-label="Compose" variant="ghost" color="danger">
        +
      </FAB>,
    );
    const button = screen.getByRole('button', { name: 'Compose' });
    expect(button.className).toContain('text-[var(--button-danger-border)]');
    expect(button.className).not.toContain('text-[var(--button-danger-text)]');
  });

  it('has no axe violations', async () => {
    const { container } = render(<FAB aria-label="Compose">+</FAB>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
