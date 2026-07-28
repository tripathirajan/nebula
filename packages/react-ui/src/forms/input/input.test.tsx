import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { Input } from './input';

describe('Input (ui)', () => {
  it('applies the default styling classes', () => {
    render(<Input aria-label="Email" />);
    expect(screen.getByRole('textbox').className).toContain('bg-[var(--input-bg)]');
  });

  it('sets aria-invalid when invalid', () => {
    render(<Input invalid aria-label="Email" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('forwards a ref to the underlying input element', () => {
    const ref = { current: null as HTMLInputElement | null };
    render(<Input ref={ref} aria-label="Email" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('has no axe violations', async () => {
    const { container } = render(<Input aria-label="Email" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
