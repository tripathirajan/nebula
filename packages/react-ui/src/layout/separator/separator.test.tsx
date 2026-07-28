import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { Separator } from './separator';

describe('Separator (ui)', () => {
  it('is decorative by default (role="none", no aria-orientation)', () => {
    render(<Separator data-testid="sep" />);
    const separator = screen.getByTestId('sep');
    expect(separator).toHaveAttribute('role', 'none');
    expect(separator).not.toHaveAttribute('aria-orientation');
  });

  it('exposes role="separator" and aria-orientation when decorative={false}', () => {
    render(<Separator decorative={false} orientation="vertical" />);
    const separator = screen.getByRole('separator');
    expect(separator).toHaveAttribute('aria-orientation', 'vertical');
  });

  it('applies horizontal vs vertical sizing classes', () => {
    const { rerender } = render(<Separator data-testid="sep" />);
    expect(screen.getByTestId('sep').className).toContain('h-px');

    rerender(<Separator orientation="vertical" data-testid="sep" />);
    expect(screen.getByTestId('sep').className).toContain('w-px');
  });

  it('has no axe violations', async () => {
    const { container } = render(<Separator decorative={false} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
